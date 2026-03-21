const { Comment } = require("../models/comments");
const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { Notification } = require("../models/notifications");


// create post
async function createPost(req, res) {
    console.log('Creating post...');
    console.log('req.files:', req.files);
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'no files uploaded' });
        }

        const mediaUrl = req.files.map((file) => file.path);
        const mediaType = req.files[0].mimetype.startsWith('image') ? 'image' : 'video';
        const { caption } = req.body;
        const userId = req.user.id;

        console.log('Post data:', { mediaUrl, mediaType, caption, userId });

        const post = await Post.create({
            mediaUrl,
            mediaType,
            caption,
            userId
        });

        res.status(201).json({ message: 'post created', post });
    } catch (error) {
        console.log(error);
        console.log(req.files);
        console.log(req.body);
        console.log(req.user);
        res.status(500).json({ message: 'internal server error' });
    }
}


// edit post
async function editPost(req, res) {
    try {
        const { caption } = req.body;
        const userId = req.user.id;
        const postId = req.params.id;

        // get post and check if the post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found' });

        // check if the user is the post owner
        if (userId != post.userId) return res.status(403).json({ message: 'you cannot edit this post' });

        // update the caption
        await post.updateOne({ $set: { caption } });

        res.json({ message: 'post updated', post });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// delete post
async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'post not found' });

        // check if the user is the post owner
        if (userId != post.userId) return res.status(403).json({ message: 'you cannot delete this post' });


        await post.deleteOne({_id: postId});
        res.json({ message: 'post deleted', post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get post by id
async function getPostById(req, res) {
    try {
        // get post by id
        const post = await Post.findById(req.params.id);

        // check if there is no post
        if (!post) return res.status(404).json({ message: 'post not found' });

        // add isLiked (likesCount is now a virtual)
        const postWithMeta = {
            ...post.toObject(),
            isLiked: post.likes.includes(req.user.id),
        };

        res.json({ message: 'post returned', post: postWithMeta });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// user likes post
async function likePost(req, res) {
    try {
        // get user from token
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // get post
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'post not found' });

        // check if the user already like the post and unlike post
        if (post.likes.includes(userId)) {
            // unlike post
            await post.updateOne({ $pull: { likes: userId } });
            await user.updateOne({ $pull: { likedPosts: postId } });

            res.json({
                message: 'unliked post',
                post,
                likes: post.likes.length,
                likedPosts: user.likedPosts
            });
        } 
            // like post
            await post.updateOne({ $push: { likes: userId } });
            await user.updateOne({ $push: { likedPosts: postId } });

            // create notfication for post owner
            await Notification.create({
                type: 'likedPost',
                sender: userId,
                user: post.userId,
                post: postId,
            });
        

        res.json({
            message: 'liked post',
            post,
            likes: post.likes.length,
            likedPosts: user.likedPosts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user liked posts
async function getLikedPosts(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const likedPosts = user.likedPosts;
        res.json({ message: 'liked posts returned', likedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get post comments
async function getPostComments(req, res) {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'post not found' });

        const postComments = await Comment.find({ postId }).populate('userId', 'username avatar');

        res.json({ message: 'post comments returned', postComments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// repost post function
async function repost(req, res) {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        // get user
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // get post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found' });

        // get post onwer
        const postOwner = await User.findById(post.userId);


        // check if the user already reposted the post and remove repost
        if (user.repostedPosts.includes(postId)) {
            await user.updateOne({
                $pull: { repostedPosts: postId }
            });
            res.json({ message: 'unreposted post' });
        }

        // repost post
        await user.updateOne({
            $push: { repostedPosts: postId }
        });

        // create notification for post owner
        await Notification.create({
            type: 'respostedYourPost',
            sender: userId,
            user: postOwner._id,
            post: postId,
        });


        res.json({ message: 'reposted post and notification sent' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// save post function
async function savePost(req, res) {
    try {
        const postId = req.params.id;

        // get user
        const user = await User.findById(req.user.id);

        // get post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found' });

        // check if the user already saved the post and remove save
        if (user.savedPosts.includes(postId)) {
            await user.updateOne({
                $pull: { savedPosts: postId }
            });
            res.json({ message: 'unsaved post' });
        }

        // save post
        await user.updateOne({
            $push: { savedPosts: postId }
        });

        res.json({ message: 'saved post' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user posts
async function getAllUserPosts(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'unauthorized' });

        const userPosts = await Post.find({ userId });

        res.json({ message: 'posts returned', posts: userPosts });
    } catch (error) {
        console.log(eror);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user reposted posts
async function getRepostedPosts(req, res) {
    try {
        const user = await User.findById(req.user.id);

        const respostedPosts = user.repostedPosts;

        res.json({ message: 'posts returned', posts: repostedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal sevrer error' });
    }
}


// get user saved posts
async function getSavedPosts(req, res) {
    try {
        const user = await User.findById(req.user.id);

        const savedPosts = user.savedPosts;

        res.json({ message: 'posts returned', posts: savedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


module.exports = {
    likePost,
    createPost,
    editPost,
    getPostById,
    deletePost,
    getLikedPosts,
    getPostComments,
    repost,
    getAllUserPosts,
    getRepostedPosts,
    getSavedPosts,
    savePost,
};