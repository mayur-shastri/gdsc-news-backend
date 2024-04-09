const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { writeComment, getComments, reactToComment, commentOnComment } = require('../../Controllers/comment');
const { isLoggedIn } = require('../../Middleware/authorization');

router.route('/write-comment')
    .post(isLoggedIn ,catchAsync(writeComment));

router.route(':story_id/get-comments')
    .get(catchAsync(getComments));

// upvote or downvote
router.route('/react-to-comment')
    .post(isLoggedIn ,catchAsync(reactToComment));

// comment on comment 
router.route('/comment-on-comment')
    .post(isLoggedIn, catchAsync(commentOnComment));

module.exports = router;