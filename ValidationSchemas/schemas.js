const BasicJoi = require('joi');
const sanitizeHTML = require('sanitize-html');
const sanitizeMongo = require('mongo-sanitize');

const Joi = BasicJoi.extend((joi)=>{
    return {
         type: 'string',
         base: joi.string(),
         messages: {
             'string.escapeHTML': '{{$label}} must not contain any HTML!',
             'string.escapeMongo': '{{$label}} must not contain any MongoDB queries!'
         },
         rules: {
             escapeHTML: {
                 validate(value, helpers) {
                     const clean = sanitizeHTML(value, {
                         allowedTags: [],
                         allowedAttributes: {},
                     });
                     if (clean !== value) return helpers.error("string.escapeHTML", {value});
                     return clean;
                 }
             },
             escapeMongo: {
                validate(value, helpers) {
                    const clean = sanitizeMongo(value);
                    if (clean !== value) return helpers.error("string.escapeMongo", { value });
                    return clean;
                }
            }
         }
    }
});

module.exports = Joi;