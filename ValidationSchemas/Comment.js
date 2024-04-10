const Joi = require("./schemas");

const commentSchema = Joi.object({
    userId: Joi.string().escapeHTML().escapeMongo(),
    commentText: Joi.string().required().escapeHTML().escapeMongo(),
});

module.exports = commentSchema;