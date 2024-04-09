// get your own userId from the token
const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const User = require('../../Models/User');
const jwt = require('jsonwebtoken');

router.route('/get-your-data')
    .get(catchAsync(async (req,res)=>{
        const token = req.cookies.token;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userName = decoded.userName;
            const user = await User.findOne({userName});
            if(!user){
                return res.status(404).send({message: "User not found", success: false});
            }
            const userObject = user.toObject();
            delete userObject.password;
            res.send({user: userObject, success: true});
        } catch (error) {
            return res.status(401).send({message: "You are not logged in", success: false});
        }
    }));

module.exports = router;