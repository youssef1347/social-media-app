const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    mediaUrl: { type: [String], required: true },
    mediaType: {type: String, enum: ['image', 'video'], required: true},
    caption: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

// Ensure virtuals are included in JSON output
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };