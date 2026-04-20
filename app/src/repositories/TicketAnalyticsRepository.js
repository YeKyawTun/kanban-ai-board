const TicketRepository = require('./TicketRepository');

class TicketAnalyticsRepository {
  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async getCompletedHistoryCountByMemberAndLabel(memberId, label) {
    const tickets = await this.ticketRepository.findAll();

    return tickets.filter((ticket) =>
      Number(ticket.assigneeId) === Number(memberId) &&
      ticket.label === label &&
      ticket.status === 'done' &&
      !ticket.archived
    ).length;
  }

  async getActiveWorkloadByMember(memberId) {
    const tickets = await this.ticketRepository.findAll();

    const visible = tickets.filter((ticket) =>
      Number(ticket.assigneeId) === Number(memberId) &&
      !ticket.archived
    );

    return {
      todo: visible.filter((ticket) => ticket.status === 'todo').length,
      inProgress: visible.filter((ticket) => ticket.status === 'in_progress').length,
      review: visible.filter((ticket) => ticket.status === 'review').length
    };
  }
}

module.exports = TicketAnalyticsRepository;

