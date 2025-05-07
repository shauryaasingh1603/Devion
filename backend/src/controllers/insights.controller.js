/**
 * Insights Controller for the MCP Server
 * Handles requests for risk analysis and insights
 */

const { asyncHandler } = require('../utils/errorHandler');
const { fetchStockData, fetchNewsData, fetchTechnicalIndicators, fetchInstitutionalActivity } = require('../services/mcp/apiOrchestrator');
const { generateRiskAnalysis, generatePortfolioRiskSummary } = require('../services/claude.service');

/**
 * Get risk analysis for a specific stock
 */
const getStockRiskAnalysis = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  
  const [stockData, newsData, technicalIndicators, institutionalActivity] = await Promise.all([
    fetchStockData(symbol),
    fetchNewsData(symbol),
    fetchTechnicalIndicators(symbol),
    fetchInstitutionalActivity(symbol)
  ]);
  
  const riskAnalysis = await generateRiskAnalysis(
    stockData,
    newsData,
    technicalIndicators,
    institutionalActivity
  );
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    riskAnalysis
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
  
  const portfolioData = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        return await fetchStockData(symbol);
      } catch (error) {
        return null;
      }
    })
  );
  
  const validPortfolioData = portfolioData.filter(data => data !== null);
  
  if (validPortfolioData.length === 0) {
    return res.status(404).json({
      error: {
        message: 'Could not fetch data for any of the provided symbols.'
      }
    });
  }
  
  const marketData = await fetchStockData('NIFTY');
  
  const riskSummary = await generatePortfolioRiskSummary(validPortfolioData, marketData);
  
  res.json({
    timestamp: new Date().toISOString(),
    portfolioSize: validPortfolioData.length,
    riskSummary
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
  const newsData = await fetchNewsData(symbol, req.query);
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    newsCount: newsData.length,
    news: newsData
  });
});

/**
 * Get institutional activity for a stock
 */
const getInstitutionalActivity = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const activity = await fetchInstitutionalActivity(symbol, req.query);
  
  res.json({
    timestamp: new Date().toISOString(),
    symbol,
    activity
  });
});

module.exports = {
  getStockRiskAnalysis,
  getPortfolioRiskSummary,
  getTechnicalIndicators,
  getNewsSentiment,
  getInstitutionalActivity
};
