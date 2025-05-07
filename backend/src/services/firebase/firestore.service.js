/**
 * Firebase Firestore Service
 * Handles database operations for portfolios, watchlists, and stock data
 */

const { firestore } = require('../../config/firebase');
const { logger } = require('../../utils/errorHandler');

const userProfilesCollection = firestore.collection('userProfiles');
const portfoliosCollection = firestore.collection('portfolios');
const watchlistsCollection = firestore.collection('watchlists');
const stocksCollection = firestore.collection('stocks');
const alertsCollection = firestore.collection('alerts');

/**
 * Portfolio Operations
 */

/**
 * Create a portfolio for a user
 * @param {string} uid - User ID
 * @param {Object} portfolioData - Portfolio data
 * @returns {Promise<Object>} - Created portfolio
 */
const createPortfolio = async (uid, portfolioData) => {
  try {
    const portfolio = {
      userId: uid,
      name: portfolioData.name || 'My Portfolio',
      description: portfolioData.description || '',
      holdings: portfolioData.holdings || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await portfoliosCollection.add(portfolio);
    
    logger.info(`Portfolio created for user ${uid}: ${docRef.id}`);
    return { id: docRef.id, ...portfolio };
  } catch (error) {
    logger.error(`Error creating portfolio: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Get a user's portfolios
 * @param {string} uid - User ID
 * @returns {Promise<Array>} - User portfolios
 */
const getUserPortfolios = async (uid) => {
  try {
    const snapshot = await portfoliosCollection
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    logger.error(`Error getting user portfolios: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Get a portfolio by ID
 * @param {string} portfolioId - Portfolio ID
 * @returns {Promise<Object>} - Portfolio data
 */
const getPortfolio = async (portfolioId) => {
  try {
    const doc = await portfoliosCollection.doc(portfolioId).get();
    
    if (!doc.exists) {
      throw new Error(`Portfolio not found: ${portfolioId}`);
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    logger.error(`Error getting portfolio: ${error.message}`, {
      stack: error.stack,
      portfolioId
    });
    throw error;
  }
};

/**
 * Update a portfolio
 * @param {string} portfolioId - Portfolio ID
 * @param {Object} portfolioData - Portfolio data to update
 * @returns {Promise<Object>} - Updated portfolio
 */
const updatePortfolio = async (portfolioId, portfolioData) => {
  try {
    const { id, userId, createdAt, ...updateData } = portfolioData;
    
    updateData.updatedAt = new Date().toISOString();
    
    await portfoliosCollection.doc(portfolioId).update(updateData);
    
    logger.info(`Portfolio updated: ${portfolioId}`);
    return await getPortfolio(portfolioId);
  } catch (error) {
    logger.error(`Error updating portfolio: ${error.message}`, {
      stack: error.stack,
      portfolioId
    });
    throw error;
  }
};

/**
 * Delete a portfolio
 * @param {string} portfolioId - Portfolio ID
 * @returns {Promise<boolean>} - Success status
 */
const deletePortfolio = async (portfolioId) => {
  try {
    await portfoliosCollection.doc(portfolioId).delete();
    
    logger.info(`Portfolio deleted: ${portfolioId}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting portfolio: ${error.message}`, {
      stack: error.stack,
      portfolioId
    });
    throw error;
  }
};

/**
 * Watchlist Operations
 */

/**
 * Create a watchlist for a user
 * @param {string} uid - User ID
 * @param {Object} watchlistData - Watchlist data
 * @returns {Promise<Object>} - Created watchlist
 */
const createWatchlist = async (uid, watchlistData) => {
  try {
    const watchlist = {
      userId: uid,
      name: watchlistData.name || 'My Watchlist',
      description: watchlistData.description || '',
      stocks: watchlistData.stocks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await watchlistsCollection.add(watchlist);
    
    logger.info(`Watchlist created for user ${uid}: ${docRef.id}`);
    return { id: docRef.id, ...watchlist };
  } catch (error) {
    logger.error(`Error creating watchlist: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Get a user's watchlists
 * @param {string} uid - User ID
 * @returns {Promise<Array>} - User watchlists
 */
const getUserWatchlists = async (uid) => {
  try {
    const snapshot = await watchlistsCollection
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    logger.error(`Error getting user watchlists: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Get a watchlist by ID
 * @param {string} watchlistId - Watchlist ID
 * @returns {Promise<Object>} - Watchlist data
 */
const getWatchlist = async (watchlistId) => {
  try {
    const doc = await watchlistsCollection.doc(watchlistId).get();
    
    if (!doc.exists) {
      throw new Error(`Watchlist not found: ${watchlistId}`);
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    logger.error(`Error getting watchlist: ${error.message}`, {
      stack: error.stack,
      watchlistId
    });
    throw error;
  }
};

/**
 * Update a watchlist
 * @param {string} watchlistId - Watchlist ID
 * @param {Object} watchlistData - Watchlist data to update
 * @returns {Promise<Object>} - Updated watchlist
 */
const updateWatchlist = async (watchlistId, watchlistData) => {
  try {
    const { id, userId, createdAt, ...updateData } = watchlistData;
    
    updateData.updatedAt = new Date().toISOString();
    
    await watchlistsCollection.doc(watchlistId).update(updateData);
    
    logger.info(`Watchlist updated: ${watchlistId}`);
    return await getWatchlist(watchlistId);
  } catch (error) {
    logger.error(`Error updating watchlist: ${error.message}`, {
      stack: error.stack,
      watchlistId
    });
    throw error;
  }
};

/**
 * Delete a watchlist
 * @param {string} watchlistId - Watchlist ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteWatchlist = async (watchlistId) => {
  try {
    await watchlistsCollection.doc(watchlistId).delete();
    
    logger.info(`Watchlist deleted: ${watchlistId}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting watchlist: ${error.message}`, {
      stack: error.stack,
      watchlistId
    });
    throw error;
  }
};

/**
 * Alert Operations
 */

/**
 * Create an alert for a user
 * @param {string} uid - User ID
 * @param {Object} alertData - Alert data
 * @returns {Promise<Object>} - Created alert
 */
const createAlert = async (uid, alertData) => {
  try {
    const alert = {
      userId: uid,
      symbol: alertData.symbol,
      type: alertData.type || 'price',
      condition: alertData.condition || '>=',
      value: alertData.value,
      message: alertData.message || '',
      active: true,
      triggered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await alertsCollection.add(alert);
    
    logger.info(`Alert created for user ${uid}: ${docRef.id}`);
    return { id: docRef.id, ...alert };
  } catch (error) {
    logger.error(`Error creating alert: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Get a user's alerts
 * @param {string} uid - User ID
 * @returns {Promise<Array>} - User alerts
 */
const getUserAlerts = async (uid) => {
  try {
    const snapshot = await alertsCollection
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    logger.error(`Error getting user alerts: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Update an alert
 * @param {string} alertId - Alert ID
 * @param {Object} alertData - Alert data to update
 * @returns {Promise<Object>} - Updated alert
 */
const updateAlert = async (alertId, alertData) => {
  try {
    const { id, userId, createdAt, ...updateData } = alertData;
    
    updateData.updatedAt = new Date().toISOString();
    
    await alertsCollection.doc(alertId).update(updateData);
    
    logger.info(`Alert updated: ${alertId}`);
    
    const updatedDoc = await alertsCollection.doc(alertId).get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
  } catch (error) {
    logger.error(`Error updating alert: ${error.message}`, {
      stack: error.stack,
      alertId
    });
    throw error;
  }
};

/**
 * Delete an alert
 * @param {string} alertId - Alert ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteAlert = async (alertId) => {
  try {
    await alertsCollection.doc(alertId).delete();
    
    logger.info(`Alert deleted: ${alertId}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting alert: ${error.message}`, {
      stack: error.stack,
      alertId
    });
    throw error;
  }
};

module.exports = {
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
  deleteAlert
};
