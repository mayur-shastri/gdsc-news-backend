const Story = require("../Models/Story");
const User = require("../Models/User");
const jwt = require('jsonwebtoken');

const writeStory = async (req,res)=>{
    const {title, content, userId} = req.body;

    if(!title || !content){
        return res.status(400).json({message: 'Title and Content are required', success: false});
    }
    
    const story = new Story({
        title,
        content,
        author: userId,
        datePosted: Date.now(),
    });

    await story.save();

    const user = await User.findById(userId);
    user.stories.push(story._id);
    user.karma += 10; // Post Karma = 10
    await user.save();

    res.status(200).json({message: 'Story added successfully', success: true, story});
}

const getStoryById = async (req,res)=>{
    const {story_id} = req.params;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const story = await Story.findById(story_id)
    .populate({
        path: 'author',
        select: 'userName profileImageUrl', // Only populate the 'username' field
    })
    .populate({
        path: 'comments',
        populate: [
            {
                path: 'user',
                model: 'User',
                select: 'userName profileImageUrl',
            },
            {
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'userName profileImageUrl',
                },
            },
        ],
    });

    if(!story){
        return res.status(404).json({message: 'Story not found', success: false});
    }

    const isUpvoted = story.upvotes.includes(userId);
    const isDownvoted = story.downvotes.includes(userId);

    const payload = {
        story,
        isUpvoted,
        isDownvoted,
        upvoteCount: story.upvotes.length,
        downvoteCount: story.downvotes.length,
        success: true,
        message: 'Story fetched successfully',
    }

    res.status(200).json(payload);

}

const reactToStory = async (req,res)=>{
    const {story_id} = req.params;
    const {reaction} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const story = await Story.findById(story_id);
    
    if(!story){
        return res.status(404).json({message: 'Story not found', success: false});
    }

    let isUpvoted = story.upvotes.includes(userId);
    let isDownvoted = story.downvotes.includes(userId);

    if(!isUpvoted && !isDownvoted){
        if(reaction == 'upvote'){
            story.upvotes.push(userId);
            isUpvoted = true;
            isDownvoted = false;
        } else if(reaction == 'downvote'){
            story.downvotes.push(userId);
            isUpvoted = false;
            isDownvoted = true;
        }
    } else if(isUpvoted && reaction == 'upvote'){
        story.upvotes.pull(userId);
        isUpvoted = false;
        isDownvoted = false;
    } else if(isDownvoted && reaction == 'downvote'){
        story.downvotes.pull(userId);
        isUpvoted = false;
        isDownvoted = false;
    } else if(isUpvoted && reaction == 'downvote'){
        story.upvotes.pull(userId);
        story.downvotes.push(userId);
        isUpvoted = false;
        isDownvoted = true;
    } else if(isDownvoted && reaction == 'upvote'){
        story.downvotes.pull(userId);
        story.upvotes.push(userId);
        isUpvoted = true;
        isDownvoted = false;
    } else{
        return res.status(400).json({message: 'Invalid reaction', success: false});
    }

    await story.save();

    const payload = {
        isUpvoted,
        isDownvoted,
        upvoteCount: story.upvotes.length,
        downvoteCount: story.downvotes.length,
        success: true,
        message: 'Story reacted successfully',
    }

    res.status(200).json(payload);

}

const getStoriesByTitle = async (req,res)=>{
    const {title} = req.params;

    const stories = await Story.find({title: { $regex: title, $options: 'i' }})
    .populate({
        path: 'author',
        select: 'userName profileImageUrl',
    });

    if(!stories){
        return res.status(404).json({message: 'Stories not found', success: false});
    }

    res.status(200).json({stories, success: true, message: 'Stories fetched successfully'});
}

const addStoryToFavourites = async (req,res)=>{
    const {story_id} = req.params;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if(user.favouriteStories.includes(story_id)){
        return res.status(400).json({message: 'Story already in favourites', success: false});
    }

    user.favouriteStories.push(story_id);

    await user.save();

    res.status(200).json({message: 'Story added to favourites successfully', success: true});

}

module.exports = {
    writeStory,
    getStoryById,
    reactToStory,
    getStoriesByTitle,
    addStoryToFavourites,
}