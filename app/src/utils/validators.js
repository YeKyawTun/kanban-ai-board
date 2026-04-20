const { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_LABELS } = require('../config/constants');

function isValidDateOnly(value) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateTicketPayload(payload, { partial = false } = {}) {
  const requiredFields = ['title', 'priority', 'label'];

  if (!partial) {
    for (const field of requiredFields) {
      if (!payload[field] || (typeof payload[field] === 'string' && payload[field].trim() === '')) {
        return `${field} is required`;
      }
    }
  }

  if ('title' in payload && (!payload.title || !String(payload.title).trim())) {
    return 'title is required';
  }

  if ('status' in payload && !TICKET_STATUSES.includes(payload.status)) {
    return `status must be one of: ${TICKET_STATUSES.join(', ')}`;
  }

  if ('priority' in payload && !TICKET_PRIORITIES.includes(payload.priority)) {
    return `priority must be one of: ${TICKET_PRIORITIES.join(', ')}`;
  }

  if ('label' in payload && !TICKET_LABELS.includes(payload.label)) {
    return `label must be one of: ${TICKET_LABELS.join(', ')}`;
  }

  if ('dueDate' in payload && !isValidDateOnly(payload.dueDate)) {
    return 'dueDate must be in YYYY-MM-DD format';
  }

  if ('assigneeId' in payload && payload.assigneeId !== null && payload.assigneeId !== undefined) {
    if (!Number.isInteger(Number(payload.assigneeId))) {
      return 'assigneeId must be a number';
    }
  }

  return null;
}

module.exports = {
  validateTicketPayload,
  isValidDateOnly
};
