const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { registerReader, readerLogin, registerAuthor, authorLogin } = require('../../Controllers/auth');
const { isAuthor, isReader } = require('../../Middleware/authorization');

router.route('/reader/register')
    .post(catchAsync(registerReader));

router.route('/reader/login')
    .post(isReader,catchAsync(readerLogin));

router.route('/author/register')
    .post(catchAsync(registerAuthor));

router.route('/author/login')
    .post(isAuthor,catchAsync(authorLogin));

module.exports = router;