
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24 hours
    mediaUrl: { type: String, required: true },
    mediaType: {type: String, enum: ['image', 'video'], required: true},
}, {timestamps: true})

// not implemented yet, will be implemented in the future