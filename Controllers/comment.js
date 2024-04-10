const Comment = require("../Models/Comment");
const Story = require("../Models/Story");
const jwt = require('jsonwebtoken');
const User = require("../Models/User");

const writeComment = async (req,res)=>{
    const {commentText} = req.body;
    const {story_id} = req.params;
    const token = req.cookies.token;

    if(!commentText){
        return res.status(400).json({message: 'Comment cannot be without text'});
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const comment = new Comment({
        user: userId,
        commentText,
        datePosted: Date.now(),
    });
    await comment.save();

    const story = await Story.findById(story_id);
    story.comments.push(comment._id);
    await story.save();

    res.status(201).json({message: 'Comment added successfully', comment, success: true});
}

const getComment = async (req,res)=>{
    const {comment_id} = req.params;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const comment = await Comment.findById(comment_id)
    .populate({
        path: 'user',
        select: 'userName profileImageUrl',
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'User',
            select: 'userName profileImageUrl',
        }
    });

    if(!comment){
        return res.status(404).json({message: 'Comment not found', success: false});
    }

    const isUpvoted = comment.upvotes.includes(userId);
    const isDownvoted = comment.downvotes.includes(userId);

    const payload = {
        comment,
        isUpvoted,
        isDownvoted,
        upvoteCount: comment.upvotes.length,
        downvoteCount: comment.downvotes.length,
        success: true,
        message: 'Comment fetched successfully',
    }

    res.status(200).json(payload);
}

const reactToComment = async (req,res)=>{
    const {comment_id} = req.params;
    const {reaction} = req.body;
    const token = req.cookies.token;
    const comment = await Comment.findById(comment_id);
    
    if(!comment){
        return res.status(404).json({message: 'Comment not found', success: false});
    }

    console.log(comment);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    let isUpvoted = comment.upvotes.includes(userId);
    let isDownvoted = comment.downvotes.includes(userId);

    if(!isUpvoted && !isDownvoted){
        if(reaction == 'upvote'){
            comment.upvotes.push(userId);
            isUpvoted = true;
            isDownvoted = false;
        } else if(reaction == 'downvote'){
            comment.downvotes.push(userId);
            isUpvoted = false;
            isDownvoted = true;
        }
    } else if(isUpvoted && reaction == 'upvote'){
        comment.upvotes.pull(userId);
        isUpvoted = false;
        isDownvoted = false;
    } else if(isDownvoted && reaction == 'downvote'){
        comment.downvotes.pull(userId);
        isUpvoted = false;
        isDownvoted = false;
    } else if(isUpvoted && reaction == 'downvote'){
        comment.upvotes.pull(userId);
        comment.downvotes.push(userId);
        isUpvoted = false;
        isDownvoted = true;
    } else if(isDownvoted && reaction == 'upvote'){
        comment.downvotes.pull(userId);
        comment.upvotes.push(userId);
        isUpvoted = true;
        isDownvoted = false;
    } else{
        return res.status(400).json({message: 'Invalid reaction', success: false});
    }

    await comment.save();

    const payload = {
        isUpvoted,
        isDownvoted,
        upvoteCount: comment.upvotes.length,
        downvoteCount: comment.downvotes.length,
        success: true,
        message: 'Comment fetched successfully',
    }

    res.status(200).json(payload);

}

const commentOnComment = async (req,res)=>{
    const {parent_comment_id} = req.params;
    const {commentText} = req.body;
    
    if(!commentText){
        return res.status(400).json({message: 'Comment cannot be without text'});
    }

    const parentComment = await Comment.findById(parent_comment_id);
    if(!parentComment){
        return res.status(404).json({message: 'Parent comment not found', success: false});
    }

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const comment = new Comment({
        user: userId,
        commentText,
        datePosted: Date.now(),
    });
    await comment.save();

    parentComment.comments.push(comment._id);
    await parentComment.save();

    const user = await User.findById(userId);
    user.karma += 1; // karma for commenting on a comment
    await user.save();

    res.status(201).json({message: 'Comment added successfully',
        parentComment,
        comment,
        success: true});
}

const addCommentToFavourites = async (req,res)=>{
    const {comment_id} = req.params;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message: 'User not found', success: false});
    }

    if(user.favouriteComments.includes(comment_id)){
        return res.status(400).json({message: 'Comment already in favourites', success: false});
    }

    user.favouriteComments.push(comment_id);
    await user.save();

    res.status(200).json({message: 'Comment added to favourites successfully', success: true});
}

module.exports = {
    writeComment,
    getComment,
    reactToComment,
    commentOnComment,
    addCommentToFavourites
}