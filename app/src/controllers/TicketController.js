const TicketService = require('../services/TicketService');
const { validateTicketPayload } = require('../utils/validators');

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  getAll = async (_req, res, next) => {
    try {
      const tickets = await this.ticketService.getAllTickets();
      res.json({ tickets });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req, res, next) => {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
      }
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const validationError = validateTicketPayload(req.body);
      if (validationError) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: validationError } });
      }
      const ticket = await this.ticketService.createTicket(req.body);
      res.status(201).json({ ticket });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const validationError = validateTicketPayload(req.body);
      if (validationError) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: validationError } });
      }
      const ticket = await this.ticketService.updateTicket(req.params.id, req.body);
      if (!ticket) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
      }
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  };

  moveStatus = async (req, res, next) => {
    try {
      const validationError = validateTicketPayload({ status: req.body.status }, { partial: true });
      if (validationError) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: validationError } });
      }
      const ticket = await this.ticketService.moveTicket(req.params.id, req.body.status);
      if (!ticket) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
      }
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await this.ticketService.deleteTicket(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
      }
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  /* v1.1 - archive endpoint for done tickets */
  archiveTicket = async (req, res, next) => {
    try {
      const ticket = await this.ticketService.archiveTicket(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Ticket not found' }
        });
      }

      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  };

}

module.exports = TicketController;
