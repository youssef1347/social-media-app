
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'likedPost',
            'likedComment',
            'acceptedFollowRequest',
            'commentOnYourPost',
            'respostedYourPost',
            'startedFollowingYou',
            'requestedToFollowYou',
            'repostedPostYouLikedOrReposted'
        ]
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // the user who triggered the notification
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // the user who recieves the notification
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };