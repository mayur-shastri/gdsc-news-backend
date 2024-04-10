const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { isAuthor, isLoggedIn } = require('../../Middleware/authorization');
const { writeStory, getStoryById, reactToStory, getStoriesByTitle } = require('../../Controllers/story');

router.route('/write-story')
    .post(isAuthor, catchAsync(writeStory));

router.route('/:story_id/get-story')
    .get(catchAsync(getStoryById));

router.route('/:story_id/react-to-story')
    .post(isLoggedIn, catchAsync(reactToStory));

// search stories by keywords
router.route('/:title/get-stories')
    .get(catchAsync(getStoriesByTitle));

// // top stories: popular stories of the week
// router.route('/:top-stories')
//     .get(catchAsync(getTopStories));

// // best stories: popular stories of all time
// router.route('/:best-stories')
//     .get(catchAsync(getBestStories));

// // Add story to favourites 
// router.route('/:story_id/add-to-favourites')
//     .get(isLoggedIn, catchAsync(addToFavourites));

module.exports = router;