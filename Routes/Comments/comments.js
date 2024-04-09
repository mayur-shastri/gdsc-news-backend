const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { writeComment, getComment, reactToComment, commentOnComment } = require('../../Controllers/comment');
const { isLoggedIn } = require('../../Middleware/authorization');

router.route('/:story_id/write-comment')
    .post(isLoggedIn ,catchAsync(writeComment));

// if a user requests to see a particular comment. Eg- a comment in the favourite comments section
router.route('/:comment_id/get-comment')
    .get(isLoggedIn, catchAsync(getComment));

// // upvote or downvote
// router.route('/react-to-comment')
//     .post(isLoggedIn ,catchAsync(reactToComment));

// // comment on comment 
// router.route('/comment-on-comment')
//     .post(isLoggedIn, catchAsync(commentOnComment));

module.exports = router;