const jwt = require('jsonwebtoken');

const isAuthor = async (req,res,next)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'author'){
        next();
    } else if(decoded.role !== 'author'){
        return res.status(401).send({message: "You are not an author", success: false});
    } else{
        return res.status(401).send({message: "You are not authorized to perform this action", success: false});
    }
}

const isReader = async (req,res,next)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role === 'reader'){
        next();
    } else if(decoded.role !== 'reader'){
        return res.status(401).send({message: "You are not a reader", success: false});
    } else{
        return res.status(401).send({message: "You are not authorized to perform this action", success: false});
    }
}

const isLoggedIn = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded){
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