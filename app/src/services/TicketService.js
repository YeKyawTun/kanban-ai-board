const TicketRepository = require('../repositories/TicketRepository');
const TeamMemberRepository = require('../repositories/TeamMemberRepository');
const Ticket = require('../domain/Ticket');
const { nextId } = require('../utils/idGenerator');
const { normalizeDueDate, nowIso } = require('../utils/dateFormatter');
const { attachAssigneeName } = require('../utils/mapper');

class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
    this.teamMemberRepository = new TeamMemberRepository();
  }

  async getAllTickets() {
    const [tickets, members] = await Promise.all([
      this.ticketRepository.findAll(),
      this.teamMemberRepository.findAll()
    ]);
    return tickets.map((ticket) => attachAssigneeName(ticket, members));
  }

  async getTicketById(id) {
    const [ticket, members] = await Promise.all([
      this.ticketRepository.findById(id),
      this.teamMemberRepository.findAll()
    ]);
    if (!ticket) return null;
    return attachAssigneeName(ticket, members);
  }

  async createTicket(payload) {
    const [tickets, members] = await Promise.all([
      this.ticketRepository.findAll(),
      this.teamMemberRepository.findAll()
    ]);
    const timestamp = nowIso();
    const ticket = new Ticket({
      id: nextId(tickets),
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      status: payload.status || 'todo',
      priority: payload.priority,
      label: payload.label,
      assigneeId: payload.assigneeId ? Number(payload.assigneeId) : null,
      dueDate: normalizeDueDate(payload.dueDate),
      createdAt: timestamp,
      updatedAt: timestamp,
      archived: false /* v1.1 - archived flag for tickets (only for done tickets) */
    });

    const created = await this.ticketRepository.create(ticket);
    return attachAssigneeName(created, members);
  }

  async updateTicket(id, payload) {
    const [existing, members] = await Promise.all([
      this.ticketRepository.findById(id),
      this.teamMemberRepository.findAll()
    ]);
    if (!existing) return null;

    const updated = await this.ticketRepository.update(id, {
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      status: payload.status,
      priority: payload.priority,
      label: payload.label,
      assigneeId: payload.assigneeId ? Number(payload.assigneeId) : null,
      dueDate: normalizeDueDate(payload.dueDate),
      updatedAt: nowIso()
    });

    return attachAssigneeName(updated, members);
  }

  async moveTicket(id, status) {
    const [existing, members] = await Promise.all([
      this.ticketRepository.findById(id),
      this.teamMemberRepository.findAll()
    ]);
    if (!existing) return null;
    const updated = await this.ticketRepository.update(id, {
      status,
      updatedAt: nowIso()
    });
    return attachAssigneeName(updated, members);
  }

  async deleteTicket(id) {
    return this.ticketRepository.delete(id);
  }

  /* v1.1 - archive ticket by setting archived flag to true (only for done tickets) */
  async archiveTicket(id) {
    const existing = await this.ticketRepository.findById(id);

    if (!existing) {
      return null;
    }

    return this.ticketRepository.update(id, {
      archived: true,
      updatedAt: nowIso()
    });
  }
}

module.exports = TicketService;
