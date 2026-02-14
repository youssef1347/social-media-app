const { Comment } = require("../models/comments");
const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { commentSchema } = require("../validation/commentValidation");



// get user profile
async function getUserProfile(req, res) {
    try {
        const { username } = req.params;

        // get user
        const user = await User.findOne({ username }).select('username followers following bio avatar');

        if (!user) return res.status(404).json({ message: 'user not found' });

        res.json({ message: 'profile returned', profile: user });
    } catch (error) {
        console.log(error);
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

        // if the user try to follow him self
        if (currentUserId == targetUserId) return res.status(400).json({ message: "you can't follow your self" });

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


module.exports = { getUserProfile, getFollowers, getFollowing, follow };