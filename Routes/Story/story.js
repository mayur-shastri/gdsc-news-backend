const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');

router.route('/write-story')
    .post(catchAsync(writeStory));

router.route('/:story_id/get-story')
    .get(catchAsync(getStory));

router.route('/:title/get-stories')
    .get(catchAsync(getStoriesByTitle));

// top stories: popular stories of the week
router.route('/:top-stories')
    .get(catchAsync(getTopStories));

// best stories: popular stories of all time
router.route('/:best-stories')
    .get(catchAsync(getBestStories));

router.route('/:story_id/react')
    .get(catchAsync(reactToStory));

module.exports = router;