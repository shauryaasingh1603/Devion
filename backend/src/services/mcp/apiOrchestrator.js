/**
 * API Orchestrator for the MCP Server
 * Manages API connections, retries, and fallbacks
 */

const { logger, ApiError } = require('../../utils/errorHandler');
const { normalizeStockData, normalizeNewsData } = require('../../utils/dataTransformer');

const braveService = require('../api/brave.service');
const kiteConnectService = require('../api/kiteconnect.service');
const yahooFinanceService = require('../api/yahoofinance.service');

/**
 * Fetch stock data with fallback mechanism
 * @param {string|Array<string>} symbols - Stock symbol or array of symbols
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Normalized stock data
 */
const fetchStockData = async (symbols, options = {}) => {
  try {
    const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];
    
    logger.info(`Fetching stock data for symbols: ${symbolsArray.join(', ')}`);
    
    let stockData = {};
    let kiteConnectError = false;
    
    try {
      stockData = await kiteConnectService.fetchStockData(symbolsArray);
      
      const missingSymbols = symbolsArray.filter(symbol => !stockData[symbol]);
      
      if (missingSymbols.length > 0) {
        logger.warn(`Missing data for symbols from Kite Connect: ${missingSymbols.join(', ')}`);
        
        const yahooData = await yahooFinanceService.fetchStockData(missingSymbols);
        
        stockData = { ...stockData, ...yahooData };
      }
    } catch (error) {
      logger.error(`Error fetching stock data from Kite Connect: ${error.message}`, {
        stack: error.stack,
        symbols: symbolsArray
      });
      
      kiteConnectError = true;
      
      try {
        stockData = await yahooFinanceService.fetchStockData(symbolsArray);
      } catch (fallbackError) {
        logger.error(`Error fetching stock data from Yahoo Finance: ${fallbackError.message}`, {
          stack: fallbackError.stack,
          symbols: symbolsArray
        });
        
        throw new ApiError(`Failed to fetch stock data from all sources`, 503, 'stockData');
      }
    }
    
    const finalMissingSymbols = symbolsArray.filter(symbol => !stockData[symbol]);
    
    if (finalMissingSymbols.length > 0) {
      logger.warn(`No data available for symbols: ${finalMissingSymbols.join(', ')}`);
    }
    
    if (!Array.isArray(symbols)) {
      return stockData[symbols] || null;
    }
    
    return stockData;
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
    logger.info(`Fetching news data for query: ${query}`);
    
    const articles = await braveService.fetchNewsArticles(
      query, 
      options.limit || 10, 
      options.timeframe || 'week'
    );
    
    return articles;
  } catch (error) {
    logger.error(`Error fetching news data: ${error.message}`, {
      stack: error.stack,
      query
    });
    return [];
  }
};

/**
 * Fetch sentiment data for a stock
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Sentiment data
 */
const fetchSentimentData = async (symbol, options = {}) => {
  try {
    logger.info(`Fetching sentiment data for symbol: ${symbol}`);
    
    const sentimentData = await braveService.fetchSentimentData(
      symbol,
      options.limit || 20
    );
    
    return sentimentData;
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
 * Fetch technical indicators for a stock with fallback mechanism
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Technical indicators
 */
const fetchTechnicalIndicators = async (symbol, options = {}) => {
  try {
    logger.info(`Fetching technical indicators for symbol: ${symbol}`);
    
    const indicators = options.indicators || ['rsi', 'macd', 'bollinger'];
    
    try {
      const technicalData = await kiteConnectService.fetchTechnicalIndicators(
        symbol,
        indicators,
        options.interval || 'day',
        options.period || 14
      );
      
      return technicalData;
    } catch (error) {
      logger.error(`Error fetching technical indicators from Kite Connect: ${error.message}`, {
        stack: error.stack,
        symbol,
        indicators
      });
      
      try {
        const technicalData = await yahooFinanceService.fetchTechnicalIndicators(
          symbol,
          indicators
        );
        
        return technicalData;
      } catch (fallbackError) {
        logger.error(`Error fetching technical indicators from Yahoo Finance: ${fallbackError.message}`, {
          stack: fallbackError.stack,
          symbol,
          indicators
        });
        
        return {
          symbol,
          indicators: {},
          timestamp: Date.now()
        };
      }
    }
  } catch (error) {
    logger.error(`Error fetching technical indicators: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    
    return {
      symbol,
      indicators: {},
      timestamp: Date.now()
    };
  }
};

/**
 * Fetch global market indices
 * @returns {Promise<Array>} - Global market indices data
 */
const fetchGlobalIndices = async () => {
  try {
    logger.info('Fetching global market indices');
    
    const indices = await yahooFinanceService.fetchGlobalIndices();
    
    return indices;
  } catch (error) {
    logger.error(`Error fetching global market indices: ${error.message}`, {
      stack: error.stack
    });
    
    return [];
  }
};

/**
 * Fetch currency exchange rates
 * @param {Array<string>} currencies - Array of currency pairs
 * @returns {Promise<Object>} - Currency exchange rates data
 */
const fetchCurrencyRates = async (currencies) => {
  try {
    logger.info('Fetching currency exchange rates');
    
    const rates = await yahooFinanceService.fetchCurrencyRates(currencies);
    
    return rates;
  } catch (error) {
    logger.error(`Error fetching currency exchange rates: ${error.message}`, {
      stack: error.stack
    });
    
    return {};
  }
};

/**
 * Fetch commodity prices
 * @param {Array<string>} commodities - Array of commodity symbols
 * @returns {Promise<Object>} - Commodity prices data
 */
const fetchCommodityPrices = async (commodities) => {
  try {
    logger.info('Fetching commodity prices');
    
    const prices = await yahooFinanceService.fetchCommodityPrices(commodities);
    
    return prices;
  } catch (error) {
    logger.error(`Error fetching commodity prices: ${error.message}`, {
      stack: error.stack
    });
    
    return {};
  }
};

/**
 * Fetch comprehensive market data for risk analysis
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Object>} - Comprehensive market data
 */
const fetchMarketData = async (symbols) => {
  try {
    logger.info(`Fetching comprehensive market data for symbols: ${symbols.join(', ')}`);
    
    const [stockData, globalIndices, currencyRates, commodityPrices] = await Promise.all([
      fetchStockData(symbols),
      fetchGlobalIndices(),
      fetchCurrencyRates(),
      fetchCommodityPrices()
    ]);
    
    return {
      stocks: stockData,
      globalIndices,
      currencies: currencyRates,
      commodities: commodityPrices,
      timestamp: Date.now()
    };
  } catch (error) {
    logger.error(`Error fetching comprehensive market data: ${error.message}`, {
      stack: error.stack,
      symbols
    });
    
    return {
      stocks: {},
      globalIndices: [],
      currencies: {},
      commodities: {},
      timestamp: Date.now()
    };
  }
};

module.exports = {
  fetchStockData,
  fetchNewsData,
  fetchSentimentData,
  fetchTechnicalIndicators,
  fetchGlobalIndices,
  fetchCurrencyRates,
  fetchCommodityPrices,
  fetchMarketData
};
