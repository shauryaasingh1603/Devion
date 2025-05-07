/**
 * Firebase Realtime Database Service
 * Handles real-time data operations for stock prices, alerts, and notifications
 */

const { database } = require('../../config/firebase');
const { logger } = require('../../utils/errorHandler');

const stockPricesRef = database.ref('stockPrices');
const alertsRef = database.ref('alerts');
const notificationsRef = database.ref('notifications');
const userStatusRef = database.ref('userStatus');

/**
 * Stock Price Operations
 */

/**
 * Update stock price in real-time database
 * @param {string} symbol - Stock symbol
 * @param {Object} priceData - Price data
 * @returns {Promise<void>}
 */
const updateStockPrice = async (symbol, priceData) => {
  try {
    await stockPricesRef.child(symbol).set({
      ...priceData,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`Stock price updated: ${symbol}`);
  } catch (error) {
    logger.error(`Error updating stock price: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    throw error;
  }
};

/**
 * Get stock price from real-time database
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} - Stock price data
 */
const getStockPrice = async (symbol) => {
  try {
    const snapshot = await stockPricesRef.child(symbol).once('value');
    return snapshot.val();
  } catch (error) {
    logger.error(`Error getting stock price: ${error.message}`, {
      stack: error.stack,
      symbol
    });
    throw error;
  }
};

/**
 * Listen for stock price updates
 * @param {string} symbol - Stock symbol
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
const listenToStockPrice = (symbol, callback) => {
  const ref = stockPricesRef.child(symbol);
  
  ref.on('value', (snapshot) => {
    callback(snapshot.val());
  }, (error) => {
    logger.error(`Error in stock price listener: ${error.message}`, {
      stack: error.stack,
      symbol
    });
  });
  
  return () => {
    ref.off('value');
  };
};

/**
 * Alert Operations
 */

/**
 * Create or update alert in real-time database
 * @param {string} alertId - Alert ID
 * @param {Object} alertData - Alert data
 * @returns {Promise<void>}
 */
const updateAlert = async (alertId, alertData) => {
  try {
    await alertsRef.child(alertId).set({
      ...alertData,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`Alert updated in real-time DB: ${alertId}`);
  } catch (error) {
    logger.error(`Error updating alert in real-time DB: ${error.message}`, {
      stack: error.stack,
      alertId
    });
    throw error;
  }
};

/**
 * Listen for alert updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
const listenToUserAlerts = (userId, callback) => {
  const ref = alertsRef.orderByChild('userId').equalTo(userId);
  
  ref.on('value', (snapshot) => {
    const alerts = [];
    snapshot.forEach((childSnapshot) => {
      alerts.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(alerts);
  }, (error) => {
    logger.error(`Error in user alerts listener: ${error.message}`, {
      stack: error.stack,
      userId
    });
  });
  
  return () => {
    ref.off('value');
  };
};

/**
 * Notification Operations
 */

/**
 * Create a notification
 * @param {string} userId - User ID
 * @param {Object} notificationData - Notification data
 * @returns {Promise<string>} - Notification ID
 */
const createNotification = async (userId, notificationData) => {
  try {
    const notification = {
      userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    const newNotificationRef = notificationsRef.child(userId).push();
    await newNotificationRef.set(notification);
    
    logger.info(`Notification created for user ${userId}: ${newNotificationRef.key}`);
    return newNotificationRef.key;
  } catch (error) {
    logger.error(`Error creating notification: ${error.message}`, {
      stack: error.stack,
      userId
    });
    throw error;
  }
};

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - User notifications
 */
const getUserNotifications = async (userId) => {
  try {
    const snapshot = await notificationsRef.child(userId).orderByChild('createdAt').once('value');
    
    const notifications = [];
    snapshot.forEach((childSnapshot) => {
      notifications.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return notifications.reverse(); // Most recent first
  } catch (error) {
    logger.error(`Error getting user notifications: ${error.message}`, {
      stack: error.stack,
      userId
    });
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
const markNotificationAsRead = async (userId, notificationId) => {
  try {
    await notificationsRef.child(userId).child(notificationId).update({
      read: true
    });
    
    logger.info(`Notification marked as read: ${notificationId}`);
  } catch (error) {
    logger.error(`Error marking notification as read: ${error.message}`, {
      stack: error.stack,
      userId,
      notificationId
    });
    throw error;
  }
};

/**
 * Listen for user notifications
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
const listenToUserNotifications = (userId, callback) => {
  const ref = notificationsRef.child(userId).orderByChild('createdAt');
  
  ref.on('value', (snapshot) => {
    const notifications = [];
    snapshot.forEach((childSnapshot) => {
      notifications.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(notifications.reverse()); // Most recent first
  }, (error) => {
    logger.error(`Error in user notifications listener: ${error.message}`, {
      stack: error.stack,
      userId
    });
  });
  
  return () => {
    ref.off('value');
  };
};

/**
 * User Status Operations
 */

/**
 * Update user online status
 * @param {string} userId - User ID
 * @param {boolean} isOnline - Online status
 * @returns {Promise<void>}
 */
const updateUserStatus = async (userId, isOnline) => {
  try {
    await userStatusRef.child(userId).update({
      online: isOnline,
      lastActive: new Date().toISOString()
    });
    
    logger.info(`User status updated: ${userId}, online: ${isOnline}`);
  } catch (error) {
    logger.error(`Error updating user status: ${error.message}`, {
      stack: error.stack,
      userId
    });
    throw error;
  }
};

/**
 * Set up user presence system
 * @param {string} userId - User ID
 * @returns {Object} - Presence handlers
 */
const setupUserPresence = (userId) => {
  const userStatusRefForUser = userStatusRef.child(userId);
  const connectedRef = database.ref('.info/connected');
  
  connectedRef.on('value', async (snapshot) => {
    if (snapshot.val() === true) {
      try {
        await userStatusRefForUser.update({
          online: true,
          lastActive: new Date().toISOString()
        });
        
        userStatusRefForUser.onDisconnect().update({
          online: false,
          lastActive: new Date().toISOString()
        });
        
        logger.info(`User presence setup: ${userId}`);
      } catch (error) {
        logger.error(`Error setting up user presence: ${error.message}`, {
          stack: error.stack,
          userId
        });
      }
    }
  });
  
  return {
    cleanup: () => {
      connectedRef.off('value');
      userStatusRefForUser.onDisconnect().cancel();
    }
  };
};

module.exports = {
  updateStockPrice,
  getStockPrice,
  listenToStockPrice,
  
  updateAlert,
  listenToUserAlerts,
  
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  listenToUserNotifications,
  
  updateUserStatus,
  setupUserPresence
};
