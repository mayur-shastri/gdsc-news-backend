const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { registerReader, readerLogin, registerAuthor, authorLogin } = require('../../Controllers/auth');

router.route('/reader/register')
    .post(catchAsync(registerReader));

router.route('/reader/login')
    .post(catchAsync(readerLogin));

router.route('/author/register')
    .post(catchAsync(registerAuthor));

router.route('/author/login')
    .post(catchAsync(authorLogin));

module.exports = router;