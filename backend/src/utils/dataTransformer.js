/**
 * Data transformation utility for the MCP Server
 * Handles normalization and transformation of data from different sources
 */

const { DataProcessingError } = require('./errorHandler');

/**
 * Normalize stock data from different sources into a consistent format
 * @param {Object} data - Raw stock data
 * @param {string} source - Source of the data (kiteConnect, yahooFinance, etc.)
 * @returns {Object} - Normalized stock data
 */
const normalizeStockData = (data, source) => {
  try {
    if (!data) {
      throw new DataProcessingError('No data provided for normalization', { source });
    }

    const normalized = {
      symbol: '',
      name: '',
      price: {
        current: 0,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        previousClose: 0
      },
      change: {
        value: 0,
        percentage: 0
      },
      volume: 0,
      marketCap: 0,
      pe: 0,
      timestamp: new Date().toISOString(),
      source
    };

    switch (source) {
      case 'kiteConnect':
        return normalizeKiteConnectData(data, normalized);
      case 'yahooFinance':
        return normalizeYahooFinanceData(data, normalized);
      default:
        throw new DataProcessingError(`Unsupported data source: ${source}`, { source });
    }
  } catch (error) {
    throw new DataProcessingError(`Error normalizing stock data: ${error.message}`, {
      source,
      originalError: error
    });
  }
};

/**
 * Normalize Kite Connect stock data
 * @param {Object} data - Raw Kite Connect data
 * @param {Object} normalized - Base normalized structure
 * @returns {Object} - Normalized stock data
 */
const normalizeKiteConnectData = (data, normalized) => {
  normalized.symbol = data.tradingsymbol || '';
  normalized.name = data.name || data.tradingsymbol || '';
  normalized.price.current = data.last_price || 0;
  normalized.price.open = data.ohlc?.open || 0;
  normalized.price.high = data.ohlc?.high || 0;
  normalized.price.low = data.ohlc?.low || 0;
  normalized.price.close = data.ohlc?.close || 0;
  normalized.price.previousClose = data.ohlc?.close || 0;
  
  if (normalized.price.previousClose > 0) {
    normalized.change.value = normalized.price.current - normalized.price.previousClose;
    normalized.change.percentage = (normalized.change.value / normalized.price.previousClose) * 100;
  }
  
  normalized.volume = data.volume || 0;
  normalized.marketCap = data.market_cap || 0;
  normalized.pe = data.pe || 0;
  normalized.timestamp = data.timestamp || new Date().toISOString();
  
  return normalized;
};

/**
 * Normalize Yahoo Finance stock data
 * @param {Object} data - Raw Yahoo Finance data
 * @param {Object} normalized - Base normalized structure
 * @returns {Object} - Normalized stock data
 */
const normalizeYahooFinanceData = (data, normalized) => {
  const quote = data.price || data.quoteSummary?.result?.[0]?.price || {};
  
  normalized.symbol = quote.symbol || '';
  normalized.name = quote.longName || quote.shortName || '';
  normalized.price.current = quote.regularMarketPrice?.raw || 0;
  normalized.price.open = quote.regularMarketOpen?.raw || 0;
  normalized.price.high = quote.regularMarketDayHigh?.raw || 0;
  normalized.price.low = quote.regularMarketDayLow?.raw || 0;
  normalized.price.close = quote.regularMarketPrice?.raw || 0;
  normalized.price.previousClose = quote.regularMarketPreviousClose?.raw || 0;
  
  normalized.change.value = quote.regularMarketChange?.raw || 0;
  normalized.change.percentage = quote.regularMarketChangePercent?.raw || 0;
  
  normalized.volume = quote.regularMarketVolume?.raw || 0;
  normalized.marketCap = quote.marketCap?.raw || 0;
  
  const financialData = data.quoteSummary?.result?.[0]?.financialData || {};
  normalized.pe = financialData.trailingPE?.raw || 0;
  
  normalized.timestamp = new Date().toISOString();
  
  return normalized;
};

/**
 * Normalize news data from different sources
 * @param {Array} data - Raw news data
 * @param {string} source - Source of the data (brave, etc.)
 * @returns {Array} - Normalized news data
 */
const normalizeNewsData = (data, source) => {
  try {
    if (!data || !Array.isArray(data)) {
      throw new DataProcessingError('Invalid news data format', { source });
    }

    switch (source) {
      case 'brave':
        return normalizeBraveNewsData(data);
      default:
        throw new DataProcessingError(`Unsupported news source: ${source}`, { source });
    }
  } catch (error) {
    throw new DataProcessingError(`Error normalizing news data: ${error.message}`, {
      source,
      originalError: error
    });
  }
};

/**
 * Normalize Brave news data
 * @param {Array} data - Raw Brave news data
 * @returns {Array} - Normalized news data
 */
const normalizeBraveNewsData = (data) => {
  return data.map(item => ({
    title: item.title || '',
    description: item.description || '',
    url: item.url || '',
    source: item.source || item.publisher || '',
    publishedAt: item.publishedAt || item.published_at || new Date().toISOString(),
    sentiment: null, // Will be filled by sentiment analysis
    relevance: null, // Will be filled by relevance scoring
    keywords: item.keywords || []
  }));
};

/**
 * Prepare data for Claude analysis
 * @param {Object} stockData - Normalized stock data
 * @param {Array} newsData - Normalized news data
 * @param {Object} technicalIndicators - Technical indicators
 * @param {Object} institutionalActivity - Institutional activity data
 * @returns {Object} - Structured data for Claude
 */
const prepareDataForClaude = (stockData, newsData, technicalIndicators, institutionalActivity) => {
  return {
    timestamp: new Date().toISOString(),
    stockData,
    newsData: newsData || [],
    technicalIndicators: technicalIndicators || {},
    institutionalActivity: institutionalActivity || {},
    metadata: {
      dataVersion: '1.0',
      sources: getDataSources(stockData, newsData, technicalIndicators, institutionalActivity)
    }
  };
};

/**
 * Get data sources from the provided data
 * @param {Object} stockData - Normalized stock data
 * @param {Array} newsData - Normalized news data
 * @param {Object} technicalIndicators - Technical indicators
 * @param {Object} institutionalActivity - Institutional activity data
 * @returns {Object} - Data sources
 */
const getDataSources = (stockData, newsData, technicalIndicators, institutionalActivity) => {
  const sources = {};
  
  if (stockData) {
    if (Array.isArray(stockData)) {
      stockData.forEach(stock => {
        sources[`stock_${stock.symbol}`] = stock.source;
      });
    } else {
      sources[`stock_${stockData.symbol}`] = stockData.source;
    }
  }
  
  if (newsData && newsData.length > 0) {
    sources.news = 'brave';
  }
  
  if (technicalIndicators) {
    sources.technicalIndicators = 'kiteConnect';
  }
  
  if (institutionalActivity) {
    sources.institutionalActivity = 'kiteConnect';
  }
  
  return sources;
};

module.exports = {
  normalizeStockData,
  normalizeNewsData,
  prepareDataForClaude
};
