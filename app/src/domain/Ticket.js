class Ticket {
  constructor({ id, title, description = '', status, priority, label, assigneeId = null, dueDate = null, createdAt, updatedAt, archived = false }) {
  //constructor({ id, title, description = '', status, priority, label, assigneeId = null, dueDate = null, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.label = label;
    this.assigneeId = assigneeId;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.archived = archived; /* v1.1 - archived flag for tickets (only for done tickets) */
  }
}

module.exports = Ticket;
