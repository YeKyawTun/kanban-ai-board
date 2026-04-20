const express = require('express');
const TicketController = require('../controllers/TicketController');

const router = express.Router();
const controller = new TicketController();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.moveStatus);
router.delete('/:id', controller.delete);
router.patch('/:id/archive', controller.archiveTicket); /* v1.1 - archive endpoint for done tickets */

module.exports = router;
