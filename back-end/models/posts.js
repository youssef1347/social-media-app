const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    mediaUrl: { type: [String], required: true },
    mediaType: {type: String, enum: ['image', 'video'], required: true},
    caption: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
}, { timestamps: true });

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
    return this.likes.length || 0;
});

// Ensure virtuals are included in JSON output


const Post = mongoose.model("Post", postSchema);

module.exports = { Post };