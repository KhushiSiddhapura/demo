const functions = require('firebase-functions');
const app = require('./server');

// Create and export the Cloud Function
exports.api = functions.https.onRequest(app);
