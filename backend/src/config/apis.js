const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const apiConfig = {
  brave: {
    baseUrl: process.env.BRAVE_API_URL,
    apiKey: process.env.BRAVE_API_KEY,
    timeout: 10000,
    headers: {
      'X-API-Key': process.env.BRAVE_API_KEY,
      'Content-Type': 'application/json'
    }
  },
  
  kiteConnect: {
    baseUrl: process.env.KITE_CONNECT_API_URL,
    apiKey: process.env.KITE_CONNECT_API_KEY,
    apiSecret: process.env.KITE_CONNECT_API_SECRET,
    timeout: 10000,
    headers: {
      'X-Kite-Version': '3',
      'Content-Type': 'application/json'
    }
  },
  
  yahooFinance: {
    baseUrl: process.env.YAHOO_FINANCE_API_URL,
    apiKey: process.env.YAHOO_FINANCE_API_KEY,
    timeout: 10000,
    headers: {
      'X-API-Key': process.env.YAHOO_FINANCE_API_KEY,
      'Content-Type': 'application/json'
    }
  },
  
  claude: {
    baseUrl: process.env.CLAUDE_API_URL,
    apiKey: process.env.CLAUDE_API_KEY,
    timeout: 30000,
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'Content-Type': 'application/json'
    }
  }
};

const createApiClient = (config) => {
  return axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: config.headers
  });
};

module.exports = {
  braveApi: createApiClient(apiConfig.brave),
  kiteConnectApi: createApiClient(apiConfig.kiteConnect),
  yahooFinanceApi: createApiClient(apiConfig.yahooFinance),
  claudeApi: createApiClient(apiConfig.claude),
  apiConfig
};
