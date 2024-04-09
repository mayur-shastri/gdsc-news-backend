const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { writeComment, getComments, reactToComment, commentOnComment } = require('../../Controllers/comment');

router.route('/write-comment')
    .post(catchAsync(writeComment));

router.route(':story_id/get-comments')
    .get(catchAsync(getComments));

// upvote or downvote
router.route('/react-to-comment')
    .post(catchAsync(reactToComment));

// comment on comment 
router.route('/comment-on-comment')
    .post(catchAsync(commentOnComment));

module.exports = router;