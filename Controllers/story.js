const Story = require("../Models/Story");
const User = require("../Models/User");

const writeStory = async (req,res)=>{
    const {title, content, userId, userName} = req.body;

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

    const story = await Story.findById(story_id)
    .populate({
        path: 'author',
        select: 'userName profileImageUrl', // Only populate the 'username' field
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'User',
            select: 'userName profileImageUrl',
        }
    });
    
    if(!story){
        return res.status(404).json({message: 'Story not found', success: false});
    }

    res.status(200).json({story, success: true, message: 'Story fetched successfully'});

}

module.exports = {
    writeStory,
    getStoryById,
}