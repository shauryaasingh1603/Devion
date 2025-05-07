/**
 * Firebase Controller
 * Handles API endpoints for Firebase services
 */

const { asyncHandler } = require('../utils/errorHandler');
const authService = require('../services/firebase/auth.service');
const firestoreService = require('../services/firebase/firestore.service');
const realtimeService = require('../services/firebase/realtime.service');
const functionsService = require('../services/firebase/functions.service');

/**
 * User Authentication
 */

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, profileData } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: {
        message: 'Email and password are required'
      }
    });
  }
  
  const user = await authService.createUser(email, password, profileData);
  
  res.status(201).json({
    message: 'User registered successfully',
    user
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  
  const profile = await authService.getUserProfile(uid);
  
  res.json(profile);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const profileData = req.body;
  
  const updatedProfile = await authService.updateUserProfile(uid, profileData);
  
  res.json({
    message: 'Profile updated successfully',
    profile: updatedProfile
  });
});

const updateNotificationSettings = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { notificationSettings } = req.body;
  
  const updatedProfile = await authService.updateNotificationSettings(uid, notificationSettings);
  
  res.json({
    message: 'Notification settings updated successfully',
    profile: updatedProfile
  });
});

/**
 * Portfolio Management
 */

const createPortfolio = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const portfolioData = req.body;
  
  const portfolio = await firestoreService.createPortfolio(uid, portfolioData);
  
  res.status(201).json({
    message: 'Portfolio created successfully',
    portfolio
  });
});

const getUserPortfolios = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  
  const portfolios = await firestoreService.getUserPortfolios(uid);
  
  res.json(portfolios);
});

const getPortfolio = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  
  const portfolio = await firestoreService.getPortfolio(portfolioId);
  
  res.json(portfolio);
});

const updatePortfolio = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  const portfolioData = req.body;
  
  const updatedPortfolio = await firestoreService.updatePortfolio(portfolioId, portfolioData);
  
  res.json({
    message: 'Portfolio updated successfully',
    portfolio: updatedPortfolio
  });
});

const deletePortfolio = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  
  await firestoreService.deletePortfolio(portfolioId);
  
  res.json({
    message: 'Portfolio deleted successfully'
  });
});

/**
 * Watchlist Management
 */

const createWatchlist = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const watchlistData = req.body;
  
  const watchlist = await firestoreService.createWatchlist(uid, watchlistData);
  
  res.status(201).json({
    message: 'Watchlist created successfully',
    watchlist
  });
});

const getUserWatchlists = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  
  const watchlists = await firestoreService.getUserWatchlists(uid);
  
  res.json(watchlists);
});

const getWatchlist = asyncHandler(async (req, res) => {
  const { watchlistId } = req.params;
  
  const watchlist = await firestoreService.getWatchlist(watchlistId);
  
  res.json(watchlist);
});

const updateWatchlist = asyncHandler(async (req, res) => {
  const { watchlistId } = req.params;
  const watchlistData = req.body;
  
  const updatedWatchlist = await firestoreService.updateWatchlist(watchlistId, watchlistData);
  
  res.json({
    message: 'Watchlist updated successfully',
    watchlist: updatedWatchlist
  });
});

const deleteWatchlist = asyncHandler(async (req, res) => {
  const { watchlistId } = req.params;
  
  await firestoreService.deleteWatchlist(watchlistId);
  
  res.json({
    message: 'Watchlist deleted successfully'
  });
});

/**
 * Alert Management
 */

const createAlert = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const alertData = req.body;
  
  const alert = await firestoreService.createAlert(uid, alertData);
  
  await functionsService.createAlertTrigger(alert.id, alertData);
  
  res.status(201).json({
    message: 'Alert created successfully',
    alert
  });
});

const getUserAlerts = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  
  const alerts = await firestoreService.getUserAlerts(uid);
  
  res.json(alerts);
});

const updateAlert = asyncHandler(async (req, res) => {
  const { alertId } = req.params;
  const alertData = req.body;
  
  const updatedAlert = await firestoreService.updateAlert(alertId, alertData);
  
  await realtimeService.updateAlert(alertId, updatedAlert);
  
  res.json({
    message: 'Alert updated successfully',
    alert: updatedAlert
  });
});

const deleteAlert = asyncHandler(async (req, res) => {
  const { alertId } = req.params;
  
  await firestoreService.deleteAlert(alertId);
  
  res.json({
    message: 'Alert deleted successfully'
  });
});

/**
 * Notification Management
 */

const getUserNotifications = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  
  const notifications = await realtimeService.getUserNotifications(uid);
  
  res.json(notifications);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { uid, notificationId } = req.params;
  
  await realtimeService.markNotificationAsRead(uid, notificationId);
  
  res.json({
    message: 'Notification marked as read'
  });
});

/**
 * Cloud Functions Management
 */

const scheduleStockDataUpdates = asyncHandler(async (req, res) => {
  const { symbols, schedule } = req.body;
  
  const result = await functionsService.scheduleStockDataUpdates(symbols, schedule);
  
  res.json({
    message: 'Stock data updates scheduled',
    result
  });
});

const scheduleRiskAnalysisUpdates = asyncHandler(async (req, res) => {
  const { portfolioIds, schedule } = req.body;
  
  const result = await functionsService.scheduleRiskAnalysisUpdates(portfolioIds, schedule);
  
  res.json({
    message: 'Risk analysis updates scheduled',
    result
  });
});

const createDailySummary = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { schedule } = req.body;
  
  const result = await functionsService.createDailySummary(uid, schedule || '0 9 * * *');
  
  res.json({
    message: 'Daily summary scheduled',
    result
  });
});

const createWeeklyReport = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { schedule } = req.body;
  
  const result = await functionsService.createWeeklyReport(uid, schedule || '0 9 * * 1');
  
  res.json({
    message: 'Weekly report scheduled',
    result
  });
});

const deployAllFunctions = asyncHandler(async (req, res) => {
  const result = await functionsService.deployAllFunctions();
  
  res.json({
    message: 'All functions deployed',
    result
  });
});

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateNotificationSettings,
  
  createPortfolio,
  getUserPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  
  createWatchlist,
  getUserWatchlists,
  getWatchlist,
  updateWatchlist,
  deleteWatchlist,
  
  createAlert,
  getUserAlerts,
  updateAlert,
  deleteAlert,
  
  getUserNotifications,
  markNotificationAsRead,
  
  scheduleStockDataUpdates,
  scheduleRiskAnalysisUpdates,
  createDailySummary,
  createWeeklyReport,
  deployAllFunctions
};
