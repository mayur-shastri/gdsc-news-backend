const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: true, 
        //default should be false, and must be made true through some verification mechanism
        //set to true for testing purposes
    },
    role: {
        type: String,
        required: true,
        enum: ['reader', 'author'],
    },
    karma: {
        type: Number,
        required: true,
        default: 0,
    },
    favouriteStories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
        }
    ],
    favouriteComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;