const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const { registerUser, userLogin } = require('../../Controllers/auth');

router.route('/register')
    .post(catchAsync(registerUser));

router.route('/login')
    .post(catchAsync(userLogin));

module.exports = router;