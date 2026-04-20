window.boardView = (() => {
  const statusMap = [
    { key: 'todo', title: 'To Do' },
    { key: 'in_progress', title: 'In Progress' },
    { key: 'review', title: 'Review' },
    { key: 'done', title: 'Done' }
  ];

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function renderCard(ticket) {
    const dueDateText = ticket.dueDate ? `Due: ${ticket.dueDate}` : 'No due date';
    const description = ticket.description ? escapeHtml(ticket.description.slice(0, 100)) : 'No description';
    return `
      <article class="card">
        <h4 class="${ticket.status === 'done' ? 'ticket-title-done' : ''}">${escapeHtml(ticket.title)}</h4>
        <div class="meta">
          <div><span class="badge">${escapeHtml(ticket.priority)}</span> <span class="badge">${escapeHtml(ticket.label)}</span></div>
          <div>Assignee: ${escapeHtml(ticket.assigneeName || 'Unassigned')}</div>
          <div>${escapeHtml(dueDateText)}</div>
        </div>
        <div class="description">${description}</div>
        <div class="card-actions">

        `+
        /* v1.0 - Fix card action buttons for To Do and Done columns
  
          <button data-action="left" data-id="${ticket.id}">←</button>
          <button data-action="right" data-id="${ticket.id}">→</button>
        */
        `
          ${ticket.status !== 'todo' ? `<button data-action="left" data-id="${ticket.id}">←</button>` : ''}
          ${ticket.status !== 'done' ? `<button data-action="right" data-id="${ticket.id}">→</button>` : ''}
          <button data-action="edit" data-id="${ticket.id}">Edit</button>

          `+
          /* v1.1 - Delete and archive buttons (only show delete for archived tickets)
            <button data-action="delete" data-id="${ticket.id}">Delete</button> 
          */
          `

          `+
          /* v1.1 */
          `
          <button data-action="${ticket.status === 'done' ? 'archive' : 'delete'}" data-id="${ticket.id}">
            ${ticket.status === 'done' ? 'Archive' : 'Delete'}
          </button>  
        </div>
      </article>
    `;
  }

  function renderBoard(tickets) {
    const board = document.getElementById('board');
    board.innerHTML = statusMap.map((status) => {
      /* v1.1 - add archived status
      const items = tickets.filter((ticket) => ticket.status === status.key);
      */
      const items = tickets.filter((ticket) => ticket.status === status.key && !ticket.archived);

      return `
      <section class="column" data-status="${status.key}">
          <h3>${status.title} (${items.length})</h3>
          ${items.map(renderCard).join('') || '<p class="muted">No tickets</p>'}
        </section>
      `;
    }).join('');
  }

  return { renderBoard, statusMap };
})();
