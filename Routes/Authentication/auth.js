const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { registerReader, readerLogin, registerAuthor, authorLogin } = require('../../Controllers/auth');
const validateBody = require('../../Middleware/schemaValidation');
const userSchema = require('../../ValidationSchemas/User');

router.route('/reader/register')
    .post(validateBody(userSchema) ,catchAsync(registerReader));

router.route('/reader/login')
    .post(catchAsync(readerLogin));

router.route('/author/register')
    .post(validateBody(userSchema), catchAsync(registerAuthor));

router.route('/author/login')
    .post(catchAsync(authorLogin));

module.exports = router;