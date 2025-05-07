/**
 * Brave Search API Service
 * Handles fetching news and search data from Brave Search API
 */

const axios = require('axios');
const { logger } = require('../../utils/errorHandler');
const { BRAVE_API_KEY, BRAVE_API_BASE_URL } = require('../../config/apis');

/**
 * Fetch news articles related to a stock or market
 * @param {string} query - Search query (e.g., stock symbol, company name)
 * @param {number} limit - Maximum number of results to return
 * @param {string} timeframe - Time range for news (e.g., 'day', 'week', 'month')
 * @returns {Promise<Array>} - Array of news articles
 */
const fetchNewsArticles = async (query, limit = 10, timeframe = 'week') => {
  try {
    logger.info(`Fetching news articles for query: ${query}, timeframe: ${timeframe}`);
    
    const response = await axios.get(`${BRAVE_API_BASE_URL}/news`, {
      params: {
        q: `${query} stock market finance`,
        count: limit,
        time_range: timeframe
      },
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    
    if (response.data && response.data.news && Array.isArray(response.data.news)) {
      return response.data.news.map(article => ({
        title: article.title,
        url: article.url,
        source: article.source,
        publishedAt: article.published_time,
        snippet: article.description,
        sentiment: null // Will be processed by Claude
      }));
    }
    
    return [];
  } catch (error) {
    logger.error(`Error fetching news articles: ${error.message}`, {
      stack: error.stack,
      query,
      timeframe
    });
    
    return [];
  }
};

/**
 * Fetch sentiment data for a stock or market
 * @param {string} symbol - Stock symbol
 * @param {number} limit - Maximum number of results to analyze
 * @returns {Promise<Object>} - Sentiment analysis data
 */
const fetchSentimentData = async (symbol, limit = 20) => {
  try {
    logger.info(`Fetching sentiment data for symbol: ${symbol}`);
    
    const articles = await fetchNewsArticles(symbol, limit, 'week');
    
    return {
      symbol,
      articles,
      timestamp: Date.now()
    };
  } catch (error) {
    logger.error(`Error fetching sentiment data: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    
    return {
      symbol,
      articles: [],
      timestamp: Date.now()
    };
  }
};

/**
 * Search for information about a stock or company
 * @param {string} query - Search query (e.g., stock symbol, company name)
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Array of search results
 */
const searchInformation = async (query, limit = 10) => {
  try {
    logger.info(`Searching information for query: ${query}`);
    
    const response = await axios.get(`${BRAVE_API_BASE_URL}/search`, {
      params: {
        q: `${query} stock company financial information`,
        count: limit
      },
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results.map(result => ({
        title: result.title,
        url: result.url,
        description: result.description
      }));
    }
    
    return [];
  } catch (error) {
    logger.error(`Error searching information: ${error.message}`, {
      stack: error.stack,
      query
    });
    
    return [];
  }
};

module.exports = {
  fetchNewsArticles,
  fetchSentimentData,
  searchInformation
};
