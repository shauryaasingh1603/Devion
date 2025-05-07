/**
 * Insights Routes for the MCP Server
 */

const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insights.controller');

router.get('/stock/:symbol/risk', insightsController.getStockRiskAnalysis);

router.post('/portfolio/risk', insightsController.getPortfolioRiskSummary);

router.get('/stock/:symbol/technical', insightsController.getTechnicalIndicators);

router.get('/stock/:symbol/news', insightsController.getNewsSentiment);

router.get('/stock/:symbol/institutional', insightsController.getInstitutionalActivity);

module.exports = router;
