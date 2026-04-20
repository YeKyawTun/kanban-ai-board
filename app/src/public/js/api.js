window.api = {
  async getTickets() {
    const response = await fetch('/api/tickets');
    if (!response.ok) throw new Error('Failed to load tickets');
    return response.json();
  },
  async getTeamMembers() {
    const response = await fetch('/api/team-members');
    if (!response.ok) throw new Error('Failed to load team members');
    return response.json();
  },
  async createTicket(payload) {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  async updateTicket(id, payload) {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  async moveTicket(id, status) {
    const response = await fetch(`/api/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  },
  async deleteTicket(id) {
    const response = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
    return response.json();
  },
  async recommendAssignee(payload) {
    const response = await fetch('/api/recommendations/assignee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  async archiveTicket(id) {
    const response = await fetch(`/api/tickets/${id}/archive`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      throw new Error('Failed to archive ticket');
    }

    return response.json();
  }
};
