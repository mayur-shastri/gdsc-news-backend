const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { writeComment, getComment, reactToComment, getAllComments, commentOnComment, addCommentToFavourites } = require('../../Controllers/comment');
const { isLoggedIn } = require('../../Middleware/authorization');

router.route('/:story_id/write-comment')
    .post(isLoggedIn ,catchAsync(writeComment));

// if a user requests to see a particular comment. 
// Eg- a comment in the favourite comments section
router.route('/:comment_id/get-comment')
    .get(catchAsync(getComment));

// get all primary comments(without the replies) of a story
router.route('/:story_id/get-comments')
    .get(catchAsync(getAllComments));

// upvote or downvote
router.route('/:comment_id/react-to-comment')
    .post(isLoggedIn ,catchAsync(reactToComment));

// comment on comment 
router.route('/:parent_comment_id/comment-on-comment')
    .post(isLoggedIn, catchAsync(commentOnComment));

// add comment to favourites
router.route('/comment/:comment_id/add-to-favourites')
    .patch(isLoggedIn, catchAsync(addCommentToFavourites));

module.exports = router;