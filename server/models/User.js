const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true // Allows nulls for old users if any (though we cleared db)
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    profile: {
        name: String,
        bio: String,
        contact: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
