const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT || 3000),
  aiEnabled: String(process.env.AI_ENABLED || 'false').toLowerCase() === 'true',
  openAiApiKey: process.env.OPENAI_API_KEY || ''
};
