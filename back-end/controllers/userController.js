const { Comment } = require("../models/comments");
const { Notification } = require("../models/notifications");
const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { getMutual } = require("../utils/getMutual");
const { commentSchema } = require("../validation/commentValidation");


// get user profile
async function getUserProfile(req, res) {
    try {

        const { id } = req.params;
        const user = await User.findById(id).select('username bio avatar privateAccount following followers blockedUsers ');
        if (!user) return res.status(404).json({ message: 'user not found' });

        // check if the user who sent request is the profile owner
        let requesterIsProfileOwner = req.user.id == id;

        // get user following and followers length
        const followersLength = user.followers.length;
        const followingLength = user.following.length;

        // get user posts length
        const postsLength = await Post.countDocuments({ userId: id });

        // check if the user that sent request is blocked by the user he checked his profile
        const requester = await User.findById(req.user.id).select('blockedUsers following closeFriends');
        if (user.blockedUsers.includes(req.user.id)) {
            return res.status(403).json({ message: 'this user has blocked you' });
        }

        // get mutual friends id
        const mutualFriendsId = getMutual(requester, user);

        // get mutual friends 
        const mutualFriends = await User.find({ _id: { $in: mutualFriendsId } }).select('username avatar');

        // chceck if the user profile is private and the user that request to get the profile is not following the user
        if (user.privateAccount && !requester.following.includes(id) && !requesterIsProfileOwner) {
            return res.status(403).json({
                message: 'this account is private',
                profile: user,
                postsLength,
                followingLength,
                followersLength,
                mutualFriendsId,
                mutualFriends
            });
        }


        // check if the requester is following the target user
        const isFollowing = requester.following.includes(id);

        const isCloseFriend = requester.closeFriends.includes(id);

        // get posts of the user
        const posts = await Post.find({userId: id}).select('mediaUrl');

        res.json({
            message: 'profile returned',
            profile: user,
            followersLength,
            followingLength,
            postsLength,
            posts,
            isFollowing,
            requesterIsProfileOwner,
            isCloseFriend,
            mutualFriendsId,
            mutualFriends
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// edit user profile
async function editUserProfile(req, res) {
    console.log(req.files)
    console.log(req.body)
    try {
        // get user
        const user = await User.findById(req.user.id).select('bio avatar');
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const { bio } = req.body;

        // check if the user didn't change anything from his info
        if (user.bio === bio && !req.file) {
            return res.status(400).json({ message: "nothing to update" });
        }

        if (bio) {
            await user.updateOne({ bio });
        }

        if (req.file) {
            await user.updateOne({ avatar: req.file.path });
        }

        res.json({ message: 'profile updated', newProfile: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get edit user info
async function getEditUserInfo(req, res) {
    try {
        const user = await User.findById(req.user.id).select('bio avatar username');
        if (!user) return res.status(401).json({ message: 'unauthorized' });
        console.log(user.avatar);

        res.json({ message: 'info returned', avatar: user.avatar, bio: user.bio, username: user.username });
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

            // remove the target user from close friends list of current user
            await currentUser.updateOne({
                $pull: { closeFriends: targetUserId }
            });

            // remove the current user from followers list of target user
            await targetUser.updateOne({
                $pull: { followers: currentUserId }
            });

            return res.json({ message: 'unfollowed successfully' });
        }

        // update the followers list of the user that get followed
        await targetUser.updateOne({
            $push: { followers: currentUserId }
        });

        // create notification for the target user
        await Notification.create({
            type: 'startedFollowingYou',
            user: targetUserId,
            sender: currentUserId,
        });

        // update the following list of the users thats follows another user
        await currentUser.updateOne({
            $push: { following: targetUserId }
        });

            res.json({ message: "followed successfully" });
    } catch (error) {
        console.log(error);
    }
}


// get home info
async function getHomeInfo(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('username avatar');
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // get posts of the users that the user follows
        const posts = await Post.find({ userId: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username avatar');

        // add isLiked for each post
        const postsWithMeta = posts.map(post => ({
            ...post.toObject(),
            isLiked: post.likes.includes(userId),
        }));

        res.json({ message: 'home info returned', user, posts: postsWithMeta });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user info
async function getUserPrivacy(req, res) {
    try {
        const user = await User.findById(req.user.id).select('privateAccount');

        res.json({ message: 'user privacy returned', privateAccount: user.privateAccount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user notifications
async function getUserNotifications(req, res) {
    try {
        // get the user
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // get the notifications
        const notifications = await Notification.find({ user: userId });

        res.json({ message: 'notifications returned', notifications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// block user function
async function blockUsers(req, res) {
    try {
        // get the user that will be blocked
        const targetUserId = req.params.id;
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({message: 'user not found'});

        // get the user that will block the target user
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) return res.status(401).json({message: 'unauthorized'});

        // check if the target user already blocked
        const isBlocked = currentUser.blockedUsers.includes(targetUserId);
        if (isBlocked) {
            await currentUser.updateOne({
                $pull: { blockedUsers: targetUserId }
            });
            return res.json({ message: 'user has been unblocked', unblockedUser: targetUserId });
        }

        // block the target user
        await currentUser.updateOne({
            $push: { blockedUsers: targetUserId },
        });

        // remove follow relationships
        await currentUser.updateOne({ $pull: { following: targetUserId } });
        await targetUser.updateOne({ $pull: { followers: currentUserId } });

        res.json({ message: 'user has been blocked', blockedUser: targetUserId });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'internal server error'});
    }
}


// change privacy
async function changePrivacy(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.user.id,
            { privateAccount: req.body.privateAccount },
            { new: true },
        );

        res.json({ message: 'privacy changed', privacy: user.privateAccount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// add close friends
async function addCloseFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select('closeFriends');

        const targetUserId = req.params.id;
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: 'user not found' });

        // check if the user is already in close friends and remove
        const isCloseFriend = user.closeFriends.includes(targetUserId);
        if (isCloseFriend) {
            user.closeFriends.filter(id => id !== targetUserId);
            await user.save();
            return res.json({ message: 'user has been removed from close friends', closeFriends: user.closeFriends });
        }

        // await user.updateOne({ $push: { closeFriends: targetUserId } });
        // res.json({message: 'user has been added to close friends', closeFriends: user.closeFriends});
        user.closeFriends.push(targetUserId);
        await user.save();
        res.json({ message: 'user has been added to close friends', closeFriends: user.closeFriends });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user main info
async function getMainInfo(req, res) {
    try {
        const user = await User.findById(req.user.id).select('username avatar bio privateAccount');

        res.json({ message: 'user main info returned', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get mutual friends 
async function getMatualFriends(req, res) {
    try {
        const currentUser = await User.findById(req.user.id).select('following');
        const targetUser = await User.findById(req.params.id).select('following');

        const currentUserFollowing = currentUser.following;
        const targetUserFollowing = targetUser.following;

        const mutualFriends = currentUserFollowing.filter(friend => targetUserFollowing.includes(friend));
        res.json({ message: 'mutual friends returned', mutualFriends });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// send follow request function
async function sendFollowRequest(req, res) {
    try {
        const currentUser = await User.findById(req.user.id).select('following');
        const targetUser = await User.findById(req.params.id).select('followers');
        if (!targetUser) return res.status(404).json({ message: 'user not found' });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get close friends
async function getCloseFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select('closeFriends following');

        const followingWithoutCloseFriends = user.following.filter(friend => !user.closeFriends.includes(friend));
        res.json({ message: 'close friends returned', following: followingWithoutCloseFriends, closeFriends: user.closeFriends });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = {
    getUserProfile,
    getFollowers,
    getFollowing,
    follow,
    getUserNotifications,
    getHomeInfo,
    blockUsers,
    editUserProfile,
    getEditUserInfo,
    getUserPrivacy,
    changePrivacy,
    addCloseFriends,
    getMainInfo,
    getMatualFriends,
    getCloseFriends,
};