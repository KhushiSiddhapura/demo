require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments({});
        console.log(`Total Users: ${count}`);

        const users = await User.find({});
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
