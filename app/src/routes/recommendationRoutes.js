const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');

const router = express.Router();
const controller = new RecommendationController();

router.post('/assignee', controller.recommendAssignee);

module.exports = router;
