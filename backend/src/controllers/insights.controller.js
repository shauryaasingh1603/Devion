/**
 * Insights Controller for the MCP Server
 * Handles requests for risk analysis and insights
 */

const { asyncHandler } = require('../utils/errorHandler');
const { 
  fetchStockData, 
  fetchNewsData, 
  fetchSentimentData,
  fetchTechnicalIndicators, 
  fetchGlobalIndices,
  fetchCurrencyRates,
  fetchCommodityPrices,
  fetchMarketData
} = require('../services/mcp/apiOrchestrator');
const { generateRiskAnalysis, generatePortfolioRiskSummary } = require('../services/claude.service');

/**
 * Get risk analysis for a specific stock
 */
const getStockRiskAnalysis = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  
  const [stockData, newsData, technicalIndicators, marketData] = await Promise.all([
    fetchStockData(symbol),
    fetchSentimentData(symbol),
    fetchTechnicalIndicators(symbol),
    fetchMarketData(['NIFTY'])
  ]);
  
  const riskAnalysis = await generateRiskAnalysis(
    stockData,
    newsData,
    technicalIndicators,
    marketData
  );
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    riskAnalysis,
    stockData,
    newsCount: newsData.articles ? newsData.articles.length : 0,
    technicalIndicators
  });
});

/**
 * Get portfolio risk summary
 */
const getPortfolioRiskSummary = asyncHandler(async (req, res) => {
  const { symbols } = req.body;
  
  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({
      error: {
        message: 'Invalid request. Please provide an array of stock symbols.'
      }
    });
  }
  
  const stockData = await fetchStockData(symbols);
  
  const validSymbols = Object.keys(stockData);
  
  if (validSymbols.length === 0) {
    return res.status(404).json({
      error: {
        message: 'Could not fetch data for any of the provided symbols.'
      }
    });
  }
  
  const marketData = await fetchMarketData(['NIFTY']);
  
  const riskSummary = await generatePortfolioRiskSummary(
    Object.values(stockData), 
    marketData
  );
  
  res.json({
    timestamp: new Date().toISOString(),
    portfolioSize: validSymbols.length,
    symbols: validSymbols,
    riskSummary,
    marketSnapshot: {
      indices: marketData.globalIndices,
      currencies: marketData.currencies,
      commodities: marketData.commodities
    }
  });
});

/**
 * Get technical indicators for a stock
 */
const getTechnicalIndicators = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const indicators = await fetchTechnicalIndicators(symbol, req.query);
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    indicators
  });
});

/**
 * Get news sentiment for a stock
 */
const getNewsSentiment = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const sentimentData = await fetchSentimentData(symbol, {
    limit: req.query.limit || 20
  });
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    articlesCount: sentimentData.articles ? sentimentData.articles.length : 0,
    articles: sentimentData.articles || []
  });
});

/**
 * Get global market indices
 */
const getGlobalIndices = asyncHandler(async (req, res) => {
  const indices = await fetchGlobalIndices();
  
  res.json({
    timestamp: new Date().toISOString(),
    count: indices.length,
    indices
  });
});

/**
 * Get currency exchange rates
 */
const getCurrencyRates = asyncHandler(async (req, res) => {
  const currencies = req.query.currencies ? 
    req.query.currencies.split(',') : 
    ['USDINR=X', 'EURUSD=X', 'GBPUSD=X'];
  
  const rates = await fetchCurrencyRates(currencies);
  
  res.json({
    timestamp: new Date().toISOString(),
    count: Object.keys(rates).length,
    rates
  });
});

/**
 * Get commodity prices
 */
const getCommodityPrices = asyncHandler(async (req, res) => {
  const commodities = req.query.commodities ? 
    req.query.commodities.split(',') : 
    ['GC=F', 'SI=F', 'CL=F', 'BZ=F'];
  
  const prices = await fetchCommodityPrices(commodities);
  
  res.json({
    timestamp: new Date().toISOString(),
    count: Object.keys(prices).length,
    prices
  });
});

/**
 * Get comprehensive market data
 */
const getMarketData = asyncHandler(async (req, res) => {
  const symbols = req.query.symbols ? 
    req.query.symbols.split(',') : 
    ['NIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
  
  const marketData = await fetchMarketData(symbols);
  
  res.json({
    timestamp: new Date().toISOString(),
    marketData
  });
});

/**
 * Get stock data
 */
const getStockData = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const stockData = await fetchStockData(symbol);
  
  if (!stockData) {
    return res.status(404).json({
      error: {
        message: `No data available for symbol: ${symbol}`
      }
    });
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    stockData
  });
});

/**
 * Get multiple stocks data
 */
const getMultipleStocksData = asyncHandler(async (req, res) => {
  const symbols = req.query.symbols ? 
    req.query.symbols.split(',') : 
    [];
  
  if (symbols.length === 0) {
    return res.status(400).json({
      error: {
        message: 'Please provide at least one symbol'
      }
    });
  }
  
  const stocksData = await fetchStockData(symbols);
  
  res.json({
    timestamp: new Date().toISOString(),
    count: Object.keys(stocksData).length,
    stocks: stocksData
  });
});

module.exports = {
  getStockRiskAnalysis,
  getPortfolioRiskSummary,
  getTechnicalIndicators,
  getNewsSentiment,
  getGlobalIndices,
  getCurrencyRates,
  getCommodityPrices,
  getMarketData,
  getStockData,
  getMultipleStocksData
};
