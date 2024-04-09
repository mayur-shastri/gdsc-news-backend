const express = require('express');
const router = express.Router();
const catchAsync = require('../../catchAsync');
const User = require('../../Models/User');

router.route('/:userName/get-user-data')
    .get(catchAsync(async (req,res)=>{
        const {userName} = req.params;
        const user = await User.findOne({userName});
        if(!user){
            return res.status(404).send({message: "User not found", success: false});
        }
        const userObject = user.toObject();
        delete userObject.password;
        res.send({user: userObject, success: true, message: "User data fetched successfully"});
    }));

module.exports = router;