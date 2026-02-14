const Joi = require("joi");


const commentSchema = Joi.object({
    commentText: Joi.string().required()
});


module.exports = { commentSchema };
