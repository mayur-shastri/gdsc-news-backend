const Joi = require("./schemas");

const commentSchema = Joi.object({
    user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    comment: Joi.string().required().escapeHTML(),
    datePosted: Joi.date().default(Date.now),
});

module.exports = commentSchema;