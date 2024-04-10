const Joi = require("./schemas");

const storySchema = Joi.object({
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().escapeHTML().escapeMongo(),
    title: Joi.string().required().escapeHTML().escapeMongo(),
    content: Joi.string().required().escapeHTML().escapeMongo(),
});

module.exports = storySchema; 