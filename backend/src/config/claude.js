const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const claudeConfig = {
  apiKey: process.env.CLAUDE_API_KEY,
  baseUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com',
  model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
  maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7'),
  timeout: parseInt(process.env.CLAUDE_TIMEOUT || '60000')
};

const claudeClient = axios.create({
  baseURL: claudeConfig.baseUrl,
  timeout: claudeConfig.timeout,
  headers: {
    'x-api-key': claudeConfig.apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
  }
});

/**
 * Generate insights using Claude
 * @param {Object} data - Structured data for Claude to analyze
 * @param {string} prompt - System prompt for Claude
 * @returns {Promise<Object>} - Claude's response
 */
const generateInsights = async (data, prompt) => {
  try {
    const response = await claudeClient.post('/v1/messages', {
      model: claudeConfig.model,
      max_tokens: claudeConfig.maxTokens,
      temperature: claudeConfig.temperature,
      system: prompt,
      messages: [
        {
          role: 'user',
          content: JSON.stringify(data)
        }
      ]
    });

    return response.data;
  } catch (error) {
    console.error('Error generating insights with Claude:', error.message);
    throw error;
  }
};

module.exports = {
  claudeConfig,
  claudeClient,
  generateInsights
};
