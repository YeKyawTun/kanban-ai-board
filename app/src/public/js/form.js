window.ticketForm = (() => {
  function getPayload() {
    return {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      status: window.appState.editingTicketId
        ? window.appState.tickets.find((ticket) => Number(ticket.id) === Number(window.appState.editingTicketId))?.status || 'todo'
        : 'todo',
      priority: document.getElementById('priority').value,
      label: document.getElementById('label').value,
      assigneeId: document.getElementById('assigneeId').value || null,
      dueDate: document.getElementById('dueDate').value || null
    };
  }

  function resetForm() {
    document.getElementById('ticket-form').reset();
    document.getElementById('ticket-id').value = '';
    document.getElementById('form-title').textContent = 'Create Ticket';
    window.appState.editingTicketId = null;
  }

  function fillForEdit(ticket) {
    document.getElementById('ticket-id').value = ticket.id;
    document.getElementById('title').value = ticket.title || '';
    document.getElementById('description').value = ticket.description || '';
    document.getElementById('priority').value = ticket.priority || 'medium';
    document.getElementById('label').value = ticket.label || 'backend';
    document.getElementById('assigneeId').value = ticket.assigneeId || '';
    document.getElementById('dueDate').value = ticket.dueDate || '';
    document.getElementById('form-title').textContent = 'Edit Ticket';
    window.appState.editingTicketId = ticket.id;
  }


  function populateAssigneeOptions(teamMembers) {
    const select = document.getElementById('assigneeId');
    select.innerHTML = '<option value="">Unassigned</option>' + teamMembers.map((member) => (
      `<option value="${member.id}">${member.name} (${member.specialization})</option>`
    )).join('');
  }

  return { getPayload, resetForm, fillForEdit, populateAssigneeOptions };
})();
