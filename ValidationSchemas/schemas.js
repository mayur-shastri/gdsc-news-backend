const BasicJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const Joi = BasicJoi.extend((joi)=>{
    return {
         type: 'string',
         base: joi.string(),
         messages: {
             'string.escapeHTML': '{{$label}} must not contain any HTML!',
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
             }
         }
    }
});

module.exports = Joi;