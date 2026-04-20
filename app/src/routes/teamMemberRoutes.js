const express = require('express');
const TeamMemberController = require('../controllers/TeamMemberController');

const router = express.Router();
const controller = new TeamMemberController();

router.get('/', controller.getAll);

module.exports = router;
