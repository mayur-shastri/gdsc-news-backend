const Joi = require("./schemas");

const storySchema = Joi.object({
    author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    title: Joi.string().required().escapeHTML(),
    content: Joi.string().required().escapeHTML(),
    datePosted: Joi.date().default(Date.now),
});

module.exports = storySchema;