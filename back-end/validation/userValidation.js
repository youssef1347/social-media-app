const joi = require("joi");

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    username: joi.string().min(3).required(),
});

const verifyOtpSchema = joi.object({
    otp: joi.string().length(6).required(),
    email: joi.string().email().required(),
});

module.exports = { loginSchema, registerSchema, verifyOtpSchema };