const Comment = require("../Models/Comment");
const Story = require("../Models/Story");

const writeComment = async (req,res)=>{
    const {commentText, userId} = req.body;
    
    if(!commentText){
        return res.status(400).json({message: 'Comment cannot be without text'});
    }

    const comment = new Comment({
        user: userId,
        commentText,
        datePosted: Date.now(),
    });
    await comment.save();

    res.status(201).json({message: 'Comment added successfully', comment, success: true});
}

const getComments = async (req,res)=>{

    const {storyId} = req.params;

    const story = await Story.findById(storyId).populate('comments');
    if(!story){
        return res.status(404).json({message: 'Story not found', success: false});
    }

    res.status(200).json({comments: story.comments, success: true, message: "Comments fetched successfully"});

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
    getComments,
    reactToComment,
    commentOnComment,
}