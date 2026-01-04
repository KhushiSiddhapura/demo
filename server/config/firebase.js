const admin = require('firebase-admin');

try {
    if (!admin.apps.length) {
        let serviceAccount;

        if (process.env.GOOGLE_CREDENTIALS) {
            // Load from Environment Variable (Render/Production)
            serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);
            console.log("Firebase Admin Initialized using GOOGLE_CREDENTIALS env var");
        } else {
            // Load from Local File (Development)
            serviceAccount = require('../service-account.json');
            console.log("Firebase Admin Initialized using service-account.json");
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (error) {
    console.warn("Firebase Admin: Could not load credentials (checked GOOGLE_CREDENTIALS env var and service-account.json).", error.message);
    if (!admin.apps.length) {
        admin.initializeApp();
    }
}

module.exports = admin;
