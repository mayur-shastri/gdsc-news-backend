const Joi = require("./schemas");

const storySchema = Joi.object({
    title: Joi.string().required().escapeHTML().escapeMongo(),
    content: Joi.string().required().escapeHTML().escapeMongo(),
});

module.exports = storySchema; 