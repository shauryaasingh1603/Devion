/**
 * Firebase Routes
 * Defines API endpoints for Firebase services
 */

const express = require('express');
const router = express.Router();
const firebaseController = require('../controllers/firebase.controller');

/**
 * User Authentication Routes
 */
router.post('/auth/register', firebaseController.registerUser);
router.get('/auth/profile/:uid', firebaseController.getUserProfile);
router.put('/auth/profile/:uid', firebaseController.updateUserProfile);
router.put('/auth/profile/:uid/notifications', firebaseController.updateNotificationSettings);

/**
 * Portfolio Management Routes
 */
router.post('/portfolios/:uid', firebaseController.createPortfolio);
router.get('/portfolios/:uid', firebaseController.getUserPortfolios);
router.get('/portfolios/detail/:portfolioId', firebaseController.getPortfolio);
router.put('/portfolios/:portfolioId', firebaseController.updatePortfolio);
router.delete('/portfolios/:portfolioId', firebaseController.deletePortfolio);

/**
 * Watchlist Management Routes
 */
router.post('/watchlists/:uid', firebaseController.createWatchlist);
router.get('/watchlists/:uid', firebaseController.getUserWatchlists);
router.get('/watchlists/detail/:watchlistId', firebaseController.getWatchlist);
router.put('/watchlists/:watchlistId', firebaseController.updateWatchlist);
router.delete('/watchlists/:watchlistId', firebaseController.deleteWatchlist);

/**
 * Alert Management Routes
 */
router.post('/alerts/:uid', firebaseController.createAlert);
router.get('/alerts/:uid', firebaseController.getUserAlerts);
router.put('/alerts/:alertId', firebaseController.updateAlert);
router.delete('/alerts/:alertId', firebaseController.deleteAlert);

/**
 * Notification Management Routes
 */
router.get('/notifications/:uid', firebaseController.getUserNotifications);
router.put('/notifications/:uid/:notificationId', firebaseController.markNotificationAsRead);

/**
 * Cloud Functions Management Routes
 */
router.post('/functions/stock-updates', firebaseController.scheduleStockDataUpdates);
router.post('/functions/risk-analysis', firebaseController.scheduleRiskAnalysisUpdates);
router.post('/functions/daily-summary/:uid', firebaseController.createDailySummary);
router.post('/functions/weekly-report/:uid', firebaseController.createWeeklyReport);
router.post('/functions/deploy', firebaseController.deployAllFunctions);

module.exports = router;
