require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log('--- USERS STATUS ---');
        users.forEach(u => {
            console.log(`User: ${u.username} | Role: ${u.role} | Approved: ${u.isApproved}`);
        });
        console.log('--------------------');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
