const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { isAuthor, isLoggedIn } = require('../../Middleware/authorization');
const { writeStory, getStoryById, reactToStory, 
        getStoriesByTitle, addStoryToFavourites } = require('../../Controllers/story');
const { getTopStories, getBestStories } = require('../../Controllers/topAndBestStories');
const validateBody = require('../../Middleware/schemaValidation');
const storySchema = require('../../ValidationSchemas/Story');

router.route('/write-story')
    .post(isAuthor, validateBody(storySchema) , catchAsync(writeStory));

router.route('/:story_id/get-story')
    .get(catchAsync(getStoryById));

router.route('/:story_id/react-to-story')
    .post(isLoggedIn, catchAsync(reactToStory));

// search stories by keywords
router.route('/:title/get-stories')
    .get(catchAsync(getStoriesByTitle));

// top stories: popular stories of the week
router.route('/top-stories')
    .get(catchAsync(getTopStories));

// best stories: popular stories of all time
router.route('/best-stories')
    .get(catchAsync(getBestStories));

// Add story to favourites 
router.route('/story/:story_id/add-to-favourites')
    .patch(isLoggedIn, catchAsync(addStoryToFavourites));

module.exports = router;