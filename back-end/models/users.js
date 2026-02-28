
const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, minLength: 10, required: true },
    username: { type: String, unique: true, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, maxLength: 6 },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    repostedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    privateAccount: {type: Boolean, default: false},
    avatar: { type: String, default: 'public, default-profile-pic-jpg' },
    bio: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };