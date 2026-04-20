async function refreshTickets() {
  const data = await window.api.getTickets();
  window.appState.tickets = data.tickets;
  window.boardView.renderBoard(window.appState.tickets);
}

async function loadTeamMembers() {
  const data = await window.api.getTeamMembers();
  window.appState.teamMembers = data.teamMembers;
  window.ticketForm.populateAssigneeOptions(window.appState.teamMembers);
}

function getNextStatus(currentStatus, direction) {
  const order = window.boardView.statusMap.map((item) => item.key);
  const index = order.indexOf(currentStatus);
  if (index === -1) return currentStatus;
  const nextIndex = direction === 'right' ? Math.min(order.length - 1, index + 1) : Math.max(0, index - 1);
  return order[nextIndex];
}

async function handleBoardClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  const ticket = window.appState.tickets.find((item) => Number(item.id) === id);
  if (!ticket) return;

  if (action === 'edit') {
    window.ticketForm.fillForEdit(ticket);
    return;
  }

  if (action === 'delete') {
    await window.api.deleteTicket(id);
    await refreshTickets();
    return;
  }

  /* v1.1 - archive action for done tickets */
  if (action === 'archive') {
    await window.api.archiveTicket(id);
    await refreshTickets();
    return;
  }

  if (action === 'left' || action === 'right') {
    const newStatus = getNextStatus(ticket.status, action);
    if (newStatus !== ticket.status) {
      await window.api.moveTicket(id, newStatus);
      await refreshTickets();
    }
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const payload = window.ticketForm.getPayload();
  const ticketId = document.getElementById('ticket-id').value;

  const response = ticketId
    ? await window.api.updateTicket(ticketId, payload)
    : await window.api.createTicket(payload);

  if (response.error) {
    alert(response.error.message);
    return;
  }

  window.ticketForm.resetForm();
  window.appState.latestRecommendation = null;
  window.recommendationView.renderRecommendation(null);
  await refreshTickets();
}

async function handleRecommendation() {
  const payload = window.ticketForm.getPayload();
  const response = await window.api.recommendAssignee(payload);

  if (response.error) {
    alert(response.error.message);
    return;
  }

  window.appState.latestRecommendation = response.recommendation;
  window.recommendationView.renderRecommendation(response.recommendation);
}

async function bootstrap() {
  await loadTeamMembers();
  await refreshTickets();

  document.getElementById('ticket-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('recommend-btn').addEventListener('click', handleRecommendation);

  document.getElementById('recommendation-panel').addEventListener('click', async (event) => {
    if (event.target.id === 'use-recommended-assignee-btn') {
      await handleUseRecommendedAssignee();
    }
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    window.ticketForm.resetForm();
  });

  document.getElementById('board').addEventListener('click', handleBoardClick);
}

async function handleUseRecommendedAssignee() {
  const recommendation = window.appState.latestRecommendation;

  if (!recommendation || !recommendation.recommendedAssignee) {
    alert('No recommendation available.');
    return;
  }

  const payload = window.ticketForm.getPayload();
  payload.assigneeId = recommendation.recommendedAssignee.id;
  payload.status = 'todo';

  const response = await window.api.createTicket(payload);

  if (response.error) {
    alert(response.error.message);
    return;
  }

  window.ticketForm.resetForm();
  window.appState.latestRecommendation = null;
  window.recommendationView.renderRecommendation(null);
  await refreshTickets();
}

bootstrap().catch((error) => {
  console.error(error);
  alert('Failed to initialize app.');
});
