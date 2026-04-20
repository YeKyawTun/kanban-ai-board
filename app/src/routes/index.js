const express = require('express');
const ticketRoutes = require('./ticketRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const teamMemberRoutes = require('./teamMemberRoutes');

const router = express.Router();

router.use('/tickets', ticketRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/team-members', teamMemberRoutes);

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

module.exports = router;
