const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    mediaUrl: { type: [String], required: true },
    mediaType: {type: String, enum: ['image', 'video'], required: true},
    caption: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

module.exports = { Post };