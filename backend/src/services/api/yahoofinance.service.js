/**
 * Yahoo Finance API Service
 * Handles fetching stock data from Yahoo Finance API as a fallback
 * and for global market cues
 */

const axios = require('axios');
const { logger } = require('../../utils/errorHandler');
const { YAHOO_FINANCE_API_KEY, YAHOO_FINANCE_API_BASE_URL } = require('../../config/apis');

/**
 * Fetch quote for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} - Quote data for the symbol
 */
const fetchQuote = async (symbol) => {
  try {
    logger.info(`Fetching Yahoo Finance quote for symbol: ${symbol}`);
    
    const formattedSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v7/finance/quote`, {
      params: {
        symbols: formattedSymbol
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result && 
        response.data.quoteResponse.result.length > 0) {
      return response.data.quoteResponse.result[0];
    }
    
    return null;
  } catch (error) {
    logger.error(`Error fetching Yahoo Finance quote: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    return null;
  }
};

/**
 * Fetch historical data for a symbol
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Candle interval (1d, 1wk, 1mo, etc.)
 * @param {string} range - Data range (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} - Historical data
 */
const fetchHistoricalData = async (symbol, interval = '1d', range = '3mo') => {
  try {
    logger.info(`Fetching Yahoo Finance historical data for symbol: ${symbol}, interval: ${interval}, range: ${range}`);
    
    const formattedSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v8/finance/chart/${formattedSymbol}`, {
      params: {
        interval,
        range
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.chart && 
        response.data.chart.result && 
        response.data.chart.result.length > 0) {
      return response.data.chart.result[0];
    }
    
    return null;
  } catch (error) {
    logger.error(`Error fetching Yahoo Finance historical data: ${error.message}`, {
      stack: error.stack,
      symbol,
      interval,
      range
    });
    return null;
  }
};

/**
 * Fetch stock data for a list of symbols
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Object>} - Stock data for the symbols
 */
const fetchStockData = async (symbols) => {
  try {
    logger.info(`Fetching Yahoo Finance stock data for symbols: ${symbols.join(', ')}`);
    
    const formattedSymbols = symbols.map(symbol => 
      symbol.includes('.') ? symbol : `${symbol}.NS`
    ).join(',');
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v7/finance/quote`, {
      params: {
        symbols: formattedSymbols
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result) {
      
      const stockData = {};
      
      for (const quote of response.data.quoteResponse.result) {
        const symbol = quote.symbol.replace('.NS', '');
        
        stockData[symbol] = {
          symbol,
          name: quote.shortName || quote.longName,
          currentPrice: quote.regularMarketPrice,
          open: quote.regularMarketOpen,
          high: quote.regularMarketDayHigh,
          low: quote.regularMarketDayLow,
          close: quote.regularMarketPreviousClose,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          volume: quote.regularMarketVolume,
          marketCap: quote.marketCap,
          fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
          averageVolume: quote.averageVolume,
          trailingPE: quote.trailingPE,
          forwardPE: quote.forwardPE,
          dividendYield: quote.dividendYield,
          lastTradeTime: quote.regularMarketTime * 1000 // Convert to milliseconds
        };
      }
      
      return stockData;
    }
    
    return {};
  } catch (error) {
    logger.error(`Error fetching Yahoo Finance stock data: ${error.message}`, {
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
 * @returns {Promise<Object>} - Technical indicators data
 */
const fetchTechnicalIndicators = async (symbol, indicators = ['rsi', 'macd', 'bollinger']) => {
  try {
    logger.info(`Fetching Yahoo Finance technical indicators for symbol: ${symbol}, indicators: ${indicators.join(', ')}`);
    
    const historicalData = await fetchHistoricalData(symbol, '1d', '3mo');
    
    return {
      symbol,
      indicators: {
        historicalData
      },
      timestamp: Date.now()
    };
  } catch (error) {
    logger.error(`Error fetching Yahoo Finance technical indicators: ${error.message}`, {
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

/**
 * Fetch global market indices
 * @returns {Promise<Array>} - Global market indices data
 */
const fetchGlobalIndices = async () => {
  try {
    logger.info('Fetching global market indices');
    
    const indices = [
      '^GSPC',  // S&P 500
      '^DJI',   // Dow Jones
      '^IXIC',  // NASDAQ
      '^FTSE',  // FTSE 100
      '^N225',  // Nikkei 225
      '^HSI',   // Hang Seng
      '^BSESN', // BSE SENSEX
      '^NSEI'   // NSE NIFTY 50
    ];
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v7/finance/quote`, {
      params: {
        symbols: indices.join(',')
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result) {
      
      return response.data.quoteResponse.result.map(index => ({
        symbol: index.symbol,
        name: index.shortName || index.longName,
        currentPrice: index.regularMarketPrice,
        change: index.regularMarketChange,
        changePercent: index.regularMarketChangePercent,
        previousClose: index.regularMarketPreviousClose,
        open: index.regularMarketOpen,
        dayHigh: index.regularMarketDayHigh,
        dayLow: index.regularMarketDayLow,
        lastTradeTime: index.regularMarketTime * 1000 // Convert to milliseconds
      }));
    }
    
    return [];
  } catch (error) {
    logger.error(`Error fetching global market indices: ${error.message}`, {
      stack: error.stack
    });
    
    return [];
  }
};

/**
 * Fetch currency exchange rates
 * @param {Array<string>} currencies - Array of currency pairs (e.g., 'USDINR', 'EURUSD')
 * @returns {Promise<Object>} - Currency exchange rates data
 */
const fetchCurrencyRates = async (currencies = ['USDINR=X', 'EURUSD=X', 'GBPUSD=X']) => {
  try {
    logger.info(`Fetching currency exchange rates for: ${currencies.join(', ')}`);
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v7/finance/quote`, {
      params: {
        symbols: currencies.join(',')
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result) {
      
      const currencyData = {};
      
      for (const currency of response.data.quoteResponse.result) {
        currencyData[currency.symbol] = {
          symbol: currency.symbol,
          name: currency.shortName || currency.longName,
          rate: currency.regularMarketPrice,
          change: currency.regularMarketChange,
          changePercent: currency.regularMarketChangePercent,
          lastTradeTime: currency.regularMarketTime * 1000 // Convert to milliseconds
        };
      }
      
      return currencyData;
    }
    
    return {};
  } catch (error) {
    logger.error(`Error fetching currency exchange rates: ${error.message}`, {
      stack: error.stack,
      currencies
    });
    
    return {};
  }
};

/**
 * Fetch commodity prices
 * @param {Array<string>} commodities - Array of commodity symbols
 * @returns {Promise<Object>} - Commodity prices data
 */
const fetchCommodityPrices = async (commodities = ['GC=F', 'SI=F', 'CL=F', 'BZ=F']) => {
  try {
    logger.info(`Fetching commodity prices for: ${commodities.join(', ')}`);
    
    const response = await axios.get(`${YAHOO_FINANCE_API_BASE_URL}/v7/finance/quote`, {
      params: {
        symbols: commodities.join(',')
      },
      headers: {
        'x-api-key': YAHOO_FINANCE_API_KEY
      }
    });
    
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result) {
      
      const commodityData = {};
      
      for (const commodity of response.data.quoteResponse.result) {
        commodityData[commodity.symbol] = {
          symbol: commodity.symbol,
          name: commodity.shortName || commodity.longName,
          price: commodity.regularMarketPrice,
          change: commodity.regularMarketChange,
          changePercent: commodity.regularMarketChangePercent,
          lastTradeTime: commodity.regularMarketTime * 1000 // Convert to milliseconds
        };
      }
      
      return commodityData;
    }
    
    return {};
  } catch (error) {
    logger.error(`Error fetching commodity prices: ${error.message}`, {
      stack: error.stack,
      commodities
    });
    
    return {};
  }
};

module.exports = {
  fetchQuote,
  fetchHistoricalData,
  fetchStockData,
  fetchTechnicalIndicators,
  fetchGlobalIndices,
  fetchCurrencyRates,
  fetchCommodityPrices
};
