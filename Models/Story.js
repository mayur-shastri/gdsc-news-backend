const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;