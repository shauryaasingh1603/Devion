/**
 * Insights Routes for the MCP Server
 * Defines API endpoints for risk analysis and market data
 */

const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insights.controller');

/**
 * Stock-specific routes
 */
router.get('/stock/:symbol', insightsController.getStockData);
router.get('/stock/:symbol/risk', insightsController.getStockRiskAnalysis);
router.get('/stock/:symbol/technical', insightsController.getTechnicalIndicators);
router.get('/stock/:symbol/news', insightsController.getNewsSentiment);

/**
 * Portfolio routes
 */
router.post('/portfolio/risk', insightsController.getPortfolioRiskSummary);

/**
 * Market data routes
 */
router.get('/market/indices', insightsController.getGlobalIndices);
router.get('/market/currencies', insightsController.getCurrencyRates);
router.get('/market/commodities', insightsController.getCommodityPrices);
router.get('/market/data', insightsController.getMarketData);

/**
 * Bulk data routes
 */
router.get('/stocks', insightsController.getMultipleStocksData);

module.exports = router;
