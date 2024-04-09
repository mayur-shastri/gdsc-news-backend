const Joi = require("./schemas");

const userSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/).required().escapeHTML(),
});

module.exports = userSchema;