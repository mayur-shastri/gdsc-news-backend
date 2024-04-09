const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');

router.route('/reader/verify')
    .post(catchAsync(async (req,res)=>{

    }));

module.exports = router;