const env = require('../config/env');
const OpenAiClient = require('../infrastructure/ai/OpenAiClient');
const { buildFallbackExplanation } = require('../utils/fallbackExplanationBuilder');

class AiExplanationService {
  constructor() {
    this.client = new OpenAiClient({ apiKey: env.openAiApiKey, enabled: env.aiEnabled });
  }

  async getExplanation(summary) {
    try {
      const explanation = await this.client.generateExplanation(summary);
      return { explanation, explanationSource: 'OpenAI' };
    } catch (error) {
      return {
        explanation: buildFallbackExplanation(summary),
        explanationSource: 'fallback'
      };
    }
  }
}

module.exports = AiExplanationService;
