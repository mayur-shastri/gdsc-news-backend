const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

const registerUser = async (req,res)=>{
    const {userName, password} = req.body;

    if(!userName || !password){
        return res.status(400).send({message: "Please provide username and password", success: false});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({userName}, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*7 });
    const user = new User({
        userName,
        password: hashedPassword,
    });

    await user.save();

    res.send({user, message: "User registered successfully", success: true});
}

const userLogin = async (req,res)=>{
    const {userName, password} = req.body;

    if(!userName || !password){
        return res.status(400).send({message: "Please provide username and password", success: false});
    }

    const user = await User.findOne({userName});
    const userObject  = user.toObject();
    delete userObject.password;
    
    if(user){
        const matchPassword = bcrypt.compare(password, user.password);
        if(matchPassword){
            const token = jwt.sign({userName}, process.env.JWT_SECRET);
            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*7});
            res.send({user: userObject, message: "Logged In Successfully", success: true});
        } else{
            res.status(401).send({message: "Invalid credentials", success: false});
        }
    } else{
        res.status(401).send({message: "Invalid credentials", success: false});
    }
}

module.exports = {
    registerUser,
    userLogin,
}