const jwt = require('jsonwebtoken');

const isAuthor = async (req,res,next)=>{
    const {userId} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'author' && decoded.userId === userId){
        next();
    } else if(decoded.role !== 'author'){
        return res.status(401).send({message: "You are not an author", success: false});
    } else{
        return res.status(401).send({message: "You are not authorized to perform this action", success: false});
    }
}

const isReader = async (req,res,next)=>{
    const {userId} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'reader' && decoded.userId === userId){
        next();
    } else if(decoded.role !== 'reader'){
        return res.status(401).send({message: "You are not a reader", success: false});
    } else{
        return res.status(401).send({message: "You are not authorized to perform this action", success: false});
    }
}

const isLoggedIn = async(req,res,next)=>{
    const {userId} = req.body;
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.userId === userId){
            next();
        } else{
            res.status(401).send({
                message: "You are not authorized to do so. Please login with a valid account",
                success: false,
            });
        }
    } catch(err){
        return res.status(401).send({message: "You are not logged in", success: false});
    }
}

module.exports = {
    isAuthor,
    isReader,
    isLoggedIn,
}