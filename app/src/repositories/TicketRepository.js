const path = require('path');
const JsonFileStorage = require('../infrastructure/storage/JsonFileStorage');

class TicketRepository {
  constructor() {
    this.storage = new JsonFileStorage();
    this.filePath = path.join(__dirname, '../data/tickets.json');
  }

  async findAll() {
    return this.storage.readArray(this.filePath);
  }

  async findById(id) {
    const tickets = await this.findAll();
    return tickets.find((ticket) => Number(ticket.id) === Number(id)) || null;
  }

  async create(ticket) {
    const tickets = await this.findAll();
    tickets.push(ticket);
    await this.storage.writeArray(this.filePath, tickets);
    return ticket;
  }

  async update(id, updates) {
    const tickets = await this.findAll();
    const index = tickets.findIndex((ticket) => Number(ticket.id) === Number(id));
    if (index === -1) return null;
    tickets[index] = { ...tickets[index], ...updates };
    await this.storage.writeArray(this.filePath, tickets);
    return tickets[index];
  }

  async delete(id) {
    const tickets = await this.findAll();
    const remaining = tickets.filter((ticket) => Number(ticket.id) !== Number(id));
    if (remaining.length === tickets.length) {
      return false;
    }
    await this.storage.writeArray(this.filePath, remaining);
    return true;
  }


}

module.exports = TicketRepository;
