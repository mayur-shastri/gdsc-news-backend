const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

const registerReader = async (req,res)=>{
    const {userName, password} = req.body;

    const existingUser = await User.findOne({userName});
    if(existingUser){
        return res.status(400).send({message: "User already exists. Try a different username.", success: false});
    }

    if(!userName || !password){
        return res.status(400).send({message: "Please provide username and password", success: false});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({userName, role: 'reader'}, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*7 });
    const user = new User({
        userName,
        password: hashedPassword,
        role: 'reader',
        // isVerified: false,
        isVerified: true,
        // default should be false, and must be made true through some verification mechanism
    });

    await user.save();

    res.send({user, message: "Reader registered successfully", success: true});
}

const readerLogin = async (req,res)=>{
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
            const token = jwt.sign({userName, role: 'reader'}, process.env.JWT_SECRET);
            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*7});
            res.send({user: userObject, message: "Logged In Successfully", success: true});
        } else{
            res.status(401).send({message: "Invalid credentials", success: false});
        }
    } else{
        res.status(401).send({message: "Invalid credentials", success: false});
    }
}

const registerAuthor = async (req,res)=>{
    const {userName, password} = req.body;

    const existingUser = await User.findOne({userName});
    if(existingUser){
        return res.status(400).send({message: "User already exists. Try a different username.", success: false});
    }

    if(!userName || !password){
        return res.status(400).send({message: "Please provide username and password", success: false});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({userName, role: 'reader', isVerified: false,}, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*7 });
    const user = new User({
        userName,
        password: hashedPassword,
        role: 'author',
        // isVerified: false,
        isVerified: true,
        // default should be false, and must be made true through some verification mechanism
    });

    await user.save();

    res.send({user, message: "Author registered successfully", success: true});
}

const authorLogin = async (req,res)=>{
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
            const token = jwt.sign({userName, role: 'author'}, process.env.JWT_SECRET);
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
    registerReader,
    readerLogin,
    registerAuthor,
    authorLogin,
}