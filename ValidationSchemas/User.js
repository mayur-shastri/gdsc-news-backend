const Joi = require("./schemas");

const userSchema = Joi.object({
    userName: Joi.string().required().escapeHTML().escapeMongo(),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)
                          .required()
                          .escapeHTML()
                          .escapeMongo()
                          .messages({
                              'string.pattern.base': 'Password must contain at least one uppercase letter, one number and one special character'
                          }),
});

module.exports = userSchema;