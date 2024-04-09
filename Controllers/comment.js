const Comment = require("../Models/Comment");
const Story = require("../Models/Story");
const jwt = require('jsonwebtoken');

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

    res.status(200).json({comment, success: true, message: 'Comment fetched successfully'});
}

const reactToComment = async (req,res)=>{
    const {commentId, reaction} = req.body;

    const comment = await Comment.findById(commentId);
    
    if(!comment){
        return res.status(404).json({message: 'Comment not found', success: false});
    }

    if(reaction === 'upvote'){
        comment.upvotes += 1;
    } else if(reaction === 'downvote'){
        comment.downvotes += 1;
    } else{
        return res.status(400).json({message: 'Invalid reaction', success: false});
    }

    await comment.save();

    res.status(200).json({message: 'Reaction added successfully', success: true});

}

const commentOnComment = async (req,res)=>{
    const {commentId, commentText, userId} = req.body;
    const parentComment = await Comment.findById(commentId);

    if(!parentComment){
        return res.status(404).json({message: 'Comment not found', success: false});
    }

    const newComment = new Comment({
        commentText,
        user: userId,
        datePosted: Date.now(),
    });

    parentComment.comments.push(newComment);
    await newComment.save();
    await parentComment.save();
    
    res.status(201).json({message: 'Comment added successfully', success: true});
}

module.exports = {
    writeComment,
    getComment,
    reactToComment,
    commentOnComment,
}