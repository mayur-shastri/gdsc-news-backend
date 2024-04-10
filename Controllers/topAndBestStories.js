const Story = require("../Models/Story");
const User = require("../Models/User");
const jwt = require('jsonwebtoken');

// top stories of the week
const getTopStories = async (req, res) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const topStories = await Story.aggregate([
        {
            $match: {
                datePosted: {
                    $gte: oneWeekAgo,
                },
            },
        },
        {
            $addFields: {
                karma: {
                    $subtract: [
                        {$size: "$upvotes",},
                        {$size: "$downvotes",}
                    ]
                }
            }
        },
        {
            $sort: {
                karma: -1,
            }
        },
        {
            $limit: 10,
        },
    ]);

    res.send({topStories, message: "Top stories of the week", success: true});
}

// best stories of all time
const getBestStories = async (req, res) => {
    const bestStories = await Story.aggregate([
        {
            $addFields: {
                karma: {
                    $subtract: [
                        {$size: "$upvotes",},
                        {$size: "$downvotes",}
                    ]
                }
            }
        },
        {
            $sort: {
                karma: -1,
            }
        },
        {
            $limit: 10,
        },
    ]);

    res.send({bestStories, message: "Best stories of all time", success: true});
}

module.exports = {
    getTopStories,
    getBestStories
}