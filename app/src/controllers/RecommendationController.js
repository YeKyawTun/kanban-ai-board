const AssigneeRecommendationService = require('../services/AssigneeRecommendationService');
const { validateTicketPayload } = require('../utils/validators');

class RecommendationController {
  constructor() {
    this.service = new AssigneeRecommendationService();
  }

  recommendAssignee = async (req, res, next) => {
    try {
      const validationError = validateTicketPayload(req.body, { partial: false });
      if (validationError) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: validationError } });
      }
      const recommendation = await this.service.recommend(req.body);
      res.json({ recommendation });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = RecommendationController;
