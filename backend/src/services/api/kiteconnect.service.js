/**
 * Kite Connect API Service
 * Handles fetching stock data from Zerodha's Kite Connect API
 */

const KiteConnect = require('kiteconnect').KiteConnect;
const { logger } = require('../../utils/errorHandler');
const { KITE_API_KEY, KITE_API_SECRET } = require('../../config/apis');

let kiteClient = null;

/**
 * Initialize Kite Connect client with API key and session token
 * @param {string} apiKey - Kite Connect API key
 * @param {string} accessToken - Kite Connect access token
 * @returns {Object} - Initialized Kite Connect client
 */
const initializeKiteClient = (apiKey = KITE_API_KEY, accessToken = null) => {
  try {
    logger.info('Initializing Kite Connect client');
    
    kiteClient = new KiteConnect({
      api_key: apiKey
    });
    
    if (accessToken) {
      kiteClient.setAccessToken(accessToken);
    }
    
    return kiteClient;
  } catch (error) {
    logger.error(`Error initializing Kite Connect client: ${error.message}`, {
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Get login URL for Kite Connect
 * @returns {string} - Login URL
 */
const getLoginURL = () => {
  try {
    if (!kiteClient) {
      initializeKiteClient();
    }
    
    return kiteClient.getLoginURL();
  } catch (error) {
    logger.error(`Error getting login URL: ${error.message}`, {
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Generate session using request token
 * @param {string} requestToken - Request token received after login
 * @returns {Promise<Object>} - Session details
 */
const generateSession = async (requestToken) => {
  try {
    if (!kiteClient) {
      initializeKiteClient();
    }
    
    const session = await kiteClient.generateSession(requestToken, KITE_API_SECRET);
    
    kiteClient.setAccessToken(session.access_token);
    
    return session;
  } catch (error) {
    logger.error(`Error generating session: ${error.message}`, {
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Fetch quote for a list of symbols
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Object>} - Quote data for the symbols
 */
const fetchQuote = async (symbols) => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Fetching quote for symbols: ${symbols.join(', ')}`);
    
    const formattedSymbols = symbols.map(symbol => `NSE:${symbol}`);
    
    const quotes = await kiteClient.getQuote(formattedSymbols);
    
    return quotes;
  } catch (error) {
    logger.error(`Error fetching quote: ${error.message}`, {
      stack: error.stack,
      symbols
    });
    throw error;
  }
};

/**
 * Fetch historical data for a symbol
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Candle interval (minute, day, etc.)
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {Promise<Array>} - Historical data
 */
const fetchHistoricalData = async (symbol, interval = 'day', from, to) => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Fetching historical data for symbol: ${symbol}, interval: ${interval}`);
    
    const formattedSymbol = `NSE:${symbol}`;
    
    const historicalData = await kiteClient.getHistoricalData(
      formattedSymbol,
      interval,
      from,
      to
    );
    
    return historicalData;
  } catch (error) {
    logger.error(`Error fetching historical data: ${error.message}`, {
      stack: error.stack,
      symbol,
      interval
    });
    throw error;
  }
};

/**
 * Fetch market depth for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} - Market depth data
 */
const fetchMarketDepth = async (symbol) => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Fetching market depth for symbol: ${symbol}`);
    
    const formattedSymbol = `NSE:${symbol}`;
    
    const marketDepth = await kiteClient.getOHLC([formattedSymbol]);
    
    return marketDepth;
  } catch (error) {
    logger.error(`Error fetching market depth: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    throw error;
  }
};

/**
 * Fetch stock instruments
 * @param {string} exchange - Exchange (NSE, BSE, etc.)
 * @returns {Promise<Array>} - Instruments data
 */
const fetchInstruments = async (exchange = 'NSE') => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Fetching instruments for exchange: ${exchange}`);
    
    const instruments = await kiteClient.getInstruments(exchange);
    
    return instruments;
  } catch (error) {
    logger.error(`Error fetching instruments: ${error.message}`, {
      stack: error.stack,
      exchange
    });
    throw error;
  }
};

/**
 * Search for instruments
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Search results
 */
const searchInstruments = async (query) => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Searching instruments for query: ${query}`);
    
    const searchResults = await kiteClient.searchInstruments('NSE', query);
    
    return searchResults;
  } catch (error) {
    logger.error(`Error searching instruments: ${error.message}`, {
      stack: error.stack,
      query
    });
    throw error;
  }
};

/**
 * Fetch stock data for a list of symbols
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Object>} - Stock data for the symbols
 */
const fetchStockData = async (symbols) => {
  try {
    if (!kiteClient) {
      throw new Error('Kite Connect client not initialized');
    }
    
    logger.info(`Fetching stock data for symbols: ${symbols.join(', ')}`);
    
    const quotes = await fetchQuote(symbols);
    
    const stockData = {};
    
    for (const symbol of symbols) {
      const formattedSymbol = `NSE:${symbol}`;
      
      if (quotes[formattedSymbol]) {
        const quote = quotes[formattedSymbol];
        
        stockData[symbol] = {
          symbol,
          name: quote.instrument_token, // Will be replaced with actual name
          currentPrice: quote.last_price,
          open: quote.ohlc.open,
          high: quote.ohlc.high,
          low: quote.ohlc.low,
          close: quote.ohlc.close,
          change: quote.change,
          changePercent: quote.change_percent,
          volume: quote.volume,
          lastTradeTime: quote.last_trade_time,
          averagePrice: quote.average_price,
          buyQuantity: quote.buy_quantity,
          sellQuantity: quote.sell_quantity,
          marketDepth: quote.depth
        };
      }
    }
    
    return stockData;
  } catch (error) {
    logger.error(`Error fetching stock data: ${error.message}`, {
      stack: error.stack,
      symbols
    });
    
    return {};
  }
};

/**
 * Fetch technical indicators for a symbol
 * @param {string} symbol - Stock symbol
 * @param {Array<string>} indicators - Array of indicator names
 * @param {string} interval - Candle interval (minute, day, etc.)
 * @param {number} period - Period for indicators
 * @returns {Promise<Object>} - Technical indicators data
 */
const fetchTechnicalIndicators = async (symbol, indicators = ['rsi', 'macd', 'bollinger'], interval = 'day', period = 14) => {
  try {
    logger.info(`Fetching technical indicators for symbol: ${symbol}, indicators: ${indicators.join(', ')}`);
    
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 100); // Get 100 days of data
    
    const historicalData = await fetchHistoricalData(symbol, interval, from, to);
    
    return {
      symbol,
      indicators: {
        historicalData
      },
      timestamp: Date.now()
    };
  } catch (error) {
    logger.error(`Error fetching technical indicators: ${error.message}`, {
      stack: error.stack,
      symbol,
      indicators
    });
    
    return {
      symbol,
      indicators: {},
      timestamp: Date.now()
    };
  }
};

module.exports = {
  initializeKiteClient,
  getLoginURL,
  generateSession,
  fetchQuote,
  fetchHistoricalData,
  fetchMarketDepth,
  fetchInstruments,
  searchInstruments,
  fetchStockData,
  fetchTechnicalIndicators
};
