/**
 * Firebase Authentication Service
 * Handles user authentication, registration, and profile management
 */

const { auth, firestore } = require('../../config/firebase');
const { logger } = require('../../utils/errorHandler');

const userProfilesCollection = firestore.collection('userProfiles');

/**
 * Create a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} profileData - Additional profile data
 * @returns {Promise<Object>} - Created user data
 */
const createUser = async (email, password, profileData = {}) => {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
      disabled: false
    });

    const userProfile = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: profileData.displayName || '',
      phoneNumber: profileData.phoneNumber || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        riskThreshold: 70,
        dailySummary: true,
        weeklyReport: true
      },
      subscription: {
        plan: 'free',
        status: 'active',
        expiresAt: null
      }
    };

    await userProfilesCollection.doc(userRecord.uid).set(userProfile);

    logger.info(`User created successfully: ${userRecord.uid}`);
    return { uid: userRecord.uid, email: userRecord.email };
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`, {
      stack: error.stack,
      email
    });
    throw error;
  }
};

/**
 * Get user profile by UID
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - User profile data
 */
const getUserProfile = async (uid) => {
  try {
    const userDoc = await userProfilesCollection.doc(uid).get();
    
    if (!userDoc.exists) {
      throw new Error(`User profile not found for UID: ${uid}`);
    }
    
    return userDoc.data();
  } catch (error) {
    logger.error(`Error getting user profile: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} uid - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
const updateUserProfile = async (uid, profileData) => {
  try {
    const { uid: _, createdAt, ...updateData } = profileData;
    
    updateData.updatedAt = new Date().toISOString();
    
    await userProfilesCollection.doc(uid).update(updateData);
    
    logger.info(`User profile updated: ${uid}`);
    return await getUserProfile(uid);
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Update user notification settings
 * @param {string} uid - User ID
 * @param {Object} notificationSettings - Notification settings to update
 * @returns {Promise<Object>} - Updated user profile
 */
const updateNotificationSettings = async (uid, notificationSettings) => {
  try {
    await userProfilesCollection.doc(uid).update({
      'settings.notifications': notificationSettings,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`User notification settings updated: ${uid}`);
    return await getUserProfile(uid);
  } catch (error) {
    logger.error(`Error updating notification settings: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Update user subscription
 * @param {string} uid - User ID
 * @param {Object} subscription - Subscription data
 * @returns {Promise<Object>} - Updated user profile
 */
const updateSubscription = async (uid, subscription) => {
  try {
    await userProfilesCollection.doc(uid).update({
      subscription,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`User subscription updated: ${uid}`);
    return await getUserProfile(uid);
  } catch (error) {
    logger.error(`Error updating subscription: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

/**
 * Delete user account
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteUser = async (uid) => {
  try {
    await auth.deleteUser(uid);
    
    await userProfilesCollection.doc(uid).delete();
    
    logger.info(`User deleted: ${uid}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`, {
      stack: error.stack,
      uid
    });
    throw error;
  }
};

module.exports = {
  createUser,
  getUserProfile,
  updateUserProfile,
  updateNotificationSettings,
  updateSubscription,
  deleteUser
};
