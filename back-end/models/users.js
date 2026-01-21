const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, minLength: 10, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, maxLength: 6 },
    otpExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };