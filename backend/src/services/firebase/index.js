/**
 * Firebase Services Index
 * Exports all Firebase services
 */

const authService = require('./auth.service');
const firestoreService = require('./firestore.service');
const realtimeService = require('./realtime.service');
const functionsService = require('./functions.service');

module.exports = {
  auth: authService,
  firestore: firestoreService,
  realtime: realtimeService,
  functions: functionsService
};
