// get your own userId from the token
const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../../Middleware/authorization');

router.route('/get-user-data')
    .get(isLoggedIn,catchAsync(async (req,res)=>{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userName = decoded.userName;
        const user = await User.findOne({userName});
        if(!user){
            return res.status(404).send({message: "User not found", success: false});
        }
        const userObject = user.toObject();
        delete userObject.password;
        res.send({user: userObject, success: true});
    }));

module.exports = router;