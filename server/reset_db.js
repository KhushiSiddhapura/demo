require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Message = require('./models/Message');

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        await User.deleteMany({});
        console.log('Cleared Users');

        await Event.deleteMany({});
        console.log('Cleared Events');

        await Message.deleteMany({});
        console.log('Cleared Messages');

        console.log('Database reset complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting DB:', error);
        process.exit(1);
    }
};

resetDB();
