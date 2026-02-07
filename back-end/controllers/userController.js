const { User } = require("../models/users");



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

        const followedById = req.user.id;
        const followedByUser = await User.findById(followedById);

        if (!followedByUser) return res.status(404).json({ message: 'user not found' });

        // get user that get followed
        const getFollowedId = req.params.id;
        const getFollowedUser = await User.findById(getFollowedId);

        if (!getFollowedUser) return res.status(404).json({ message: "user not found" });

        // if the user try to follow him self
        if (followedById == getFollowedId) return res.status(400).json({ message: "you can't follow your self" });

        // if the user already follows the another user
        if (followedByUser.following.includes(getFollowedId)) return res.status(400).json({ message: 'you already follows this user' });

        // update the followers list of the user that get followed
        await getFollowedUser.updateOne({
            $addToSet: { followers: followedById }
        });

        // update the following list of the users thats follows another user
        await followedByUser.updateOne({
            $addToSet: { following: getFollowedId }
        });

            res.json({ message: "followed successfully" });
    } catch (error) {
        console.log(error);
    }
}


// user unFollow another user function
async function unFollow(req, res) {
    try {
        // get user followed by

        const followedById = req.user.id;
        const followedByUser = await User.findById(followedById);

        if (!followedByUser) return res.status(404).json({ message: 'user not found' });

        // get user that get followed
        const getFollowedId = req.params.id;
        const getFollowedUser = await User.findById(getFollowedId);

        if (!getFollowedUser) return res.status(404).json({ message: "user not found" });

        // if the user try to follow him self
        if (followedById == getFollowedId) return res.status(400).json({ message: "you can't follow your self" });

        // if the user already follows the another user
        if (!followedByUser.following.includes(getFollowedId)) return res.status(400).json({ message: 'you already follows this user' });

        // update the followers list of the user that get followed
        await getFollowedUser.updateOne({
            $pull: { followers: followedById }
        });

        // update the following list of the users thats follows another user
        await followedByUser.updateOne({
            $pull: { following: getFollowedId }
        });

            res.json({ message: "followed successfully" });
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getUserProfile, getFollowers, getFollowing, follow, unFollow };