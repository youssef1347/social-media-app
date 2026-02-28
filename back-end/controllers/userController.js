const { Comment } = require("../models/comments");
const { Notification } = require("../models/notifications");
const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { commentSchema } = require("../validation/commentValidation");


// get user profile
async function getUserProfile(req, res) {
    try {
        const { id } = req.params;

        // get user
        const profileInfo = await User.findById(id).select('username bio avatar');

        // get user following and followers length
        const followersLength = profileInfo.followers.length;
        const followingLength = profileInfo.following.length;

        // get user posts length
        const postsLength = await Post.countDocuments({ userId: id });

        // get posts of the user
        const posts = await Post.find({userId: id}).populate('mediaUrl');

        if (!profileInfo) return res.status(404).json({ message: 'user not found' });

        res.json({
            message: 'profile returned',
            profile: profileInfo,
            followersLength,
            followingLength,
            postsLength,
            posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user followers list
async function getFollowers(req, res) {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).populate('followers', 'username avatar');

        if (!user) return res.status(404).json({ message: 'user not found' });

        res.json({ message: 'followers returned', followers: user.followers });
    } catch (error) {
        console.log(error);
    }
}


// get user following list
async function getFollowing(req, res) {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).populate('following', 'username avatar');

        if (!user) return res.status(404).json({ message: 'user not found' });

        res.json({ message: 'following returned', following: user.following });
    } catch (error) {
        console.log(error);
    }
}


// user follow another user function
async function follow(req, res) {
    try {
        // get user followed by
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) return res.status(401).json({ message: 'Unauthorized' });

        // get user that get followed
        const targetUserId = req.params.id;
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: "user not found" });

        // check if the taget user account is private
        if (targetUser.privateAccount) {
            // create notification for the target user
            await Notification.create({
                type: 'requestedToFollowYou',
                sender: currentUserId,
                user: targetUserId,
            });
            return res.status(200).json({ message: 'this account is private, follow request sent' });
        }

        // if the user try to follow him self
        if (currentUserId == targetUserId) return res.status(400).json({
            message: "you can't follow your self"
        });

        // if the user already follows the another user
        if (currentUser.following.includes(targetUserId)) {
            // remove the target user from following list of current user
            await currentUser.updateOne({
                $pull: { following: targetUserId }
            });

            // remove the current user from followers list of target user
            await targetUser.updateOne({
                $pull: { followers: currentUserId }
            });

            return res.json({ message: 'unfollowed successfully' });
        }

        // update the followers list of the user that get followed
        await targetUser.updateOne({
            $addToSet: { followers: currentUserId }
        });

        // update the following list of the users thats follows another user
        await currentUser.updateOne({
            $addToSet: { following: targetUserId }
        });

            res.json({ message: "followed successfully" });
    } catch (error) {
        console.log(error);
    }
}


// get user following posts
async function getFollowingPosts(req, res) {
    try {
        // get user
        const userId = req.user.id;
        const user = await User.findById(userId);

        // check if there is no user
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // get posts of the users that the user follows
        const posts = await Post.find({ userId: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username avatar');

        res.json({ message: 'posts returned', posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get home info
async function getHomeInfo(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('username avatar');
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        res.json({ message: 'home info returned', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


module.exports = { getUserProfile, getFollowers, getFollowing, follow, getFollowingPosts, getHomeInfo };