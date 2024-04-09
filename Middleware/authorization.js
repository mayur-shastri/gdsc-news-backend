const jwt = require('jsonwebtoken');

const isAuthor = async (req,res,next)=>{
    const {userName} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'author' && decoded.userName === userName){
        next();
    } else{
        return res.status(401).send({message: "You are not an author", success: false});
    }
}

const isReader = async (req,res,next)=>{
    const {userName} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'reader' && decoded.userName === userName){
        next();
    } else{
        return res.status(401).send({message: "You are not a reader", success: false});
    }
}

const isLoggedIn = async(req,res,next)=>{
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch(err){
        return res.status(401).send({message: "You are not logged in", success: false});
    }
}

module.exports = {
    isAuthor,
    isReader,
    isLoggedIn,
}