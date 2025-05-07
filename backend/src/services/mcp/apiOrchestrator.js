/**
 * API Orchestrator for the MCP Server
 * Manages API connections, retries, and fallbacks
 */

const { ApiError, logApiError } = require('../../utils/errorHandler');
const { normalizeStockData, normalizeNewsData } = require('../../utils/dataTransformer');
const apiConfig = require('../../config/apis');

/**
 * Fetch stock data with fallback mechanism
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Normalized stock data
 */
const fetchStockData = async (symbol, options = {}) => {
  try {
    try {
      const response = await apiConfig.kiteConnectApi.get(`/quote`, {
        params: { symbols: symbol }
      });
      
      if (response.data && response.data[symbol]) {
        return normalizeStockData(response.data[symbol], 'kiteConnect');
      }
    } catch (error) {
      logApiError(error, 'kiteConnect');
    }
    
    try {
      const response = await apiConfig.yahooFinanceApi.get(`/v6/finance/quote`, {
        params: { symbols: symbol }
      });
      
      if (response.data && response.data.quoteResponse && 
          response.data.quoteResponse.result && 
          response.data.quoteResponse.result.length > 0) {
        return normalizeStockData(response.data.quoteResponse.result[0], 'yahooFinance');
      }
    } catch (error) {
      logApiError(error, 'yahooFinance');
      throw new ApiError(`Failed to fetch stock data for ${symbol} from all sources`, 503, 'stockData');
    }
    
    throw new ApiError(`No data available for ${symbol}`, 404, 'stockData');
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Error fetching stock data: ${error.message}`, 500, 'stockData');
  }
};

/**
 * Fetch news data for a stock
 * @param {string} query - Search query (usually stock symbol or company name)
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} - Normalized news data
 */
const fetchNewsData = async (query, options = {}) => {
  try {
    const response = await apiConfig.braveApi.get(`/news/search`, {
      params: {
        q: query,
        count: options.count || 10,
        freshness: options.freshness || 'week'
      }
    });
    
    if (response.data && response.data.articles) {
      return normalizeNewsData(response.data.articles, 'brave');
    }
    
    return [];
  } catch (error) {
    logApiError(error, 'braveNews');
    return [];
  }
};

/**
 * Fetch technical indicators for a stock
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Technical indicators
 */
const fetchTechnicalIndicators = async (symbol, options = {}) => {
  try {
    try {
      const response = await apiConfig.kiteConnectApi.get(`/indicators`, {
        params: { 
          symbol,
          indicators: options.indicators || 'rsi,macd,sma,ema,bbands'
        }
      });
      
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      logApiError(error, 'kiteConnectIndicators');
    }
    
    return {
      rsi: null,
      macd: null,
      sma: null,
      ema: null,
      bbands: null
    };
  } catch (error) {
    logApiError(error, 'technicalIndicators');
    return {};
  }
};

/**
 * Fetch institutional activity for a stock
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Institutional activity data
 */
const fetchInstitutionalActivity = async (symbol, options = {}) => {
  try {
    try {
      const response = await apiConfig.kiteConnectApi.get(`/institutional-activity`, {
        params: { 
          symbol,
          days: options.days || 7
        }
      });
      
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      logApiError(error, 'kiteConnectInstitutional');
    }
    
    return {
      netActivity: null,
      buyVolume: null,
      sellVolume: null,
      history: []
    };
  } catch (error) {
    logApiError(error, 'institutionalActivity');
    return {};
  }
};

module.exports = {
  fetchStockData,
  fetchNewsData,
  fetchTechnicalIndicators,
  fetchInstitutionalActivity
};
