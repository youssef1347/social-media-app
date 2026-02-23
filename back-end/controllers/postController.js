const { Comment } = require("../models/comments");
const { Post } = require("../models/posts");
const { User } = require("../models/users");


// create post
async function createPost(req, res) {
    try {
        const images = req.files.map((file) => file.path);
        const { caption } = req.body;
        const userId = req.user.id;

        const post = await Post.create({
            images,
            caption,
            userId
        });

        res.status(201).json({ message: 'post created', post });
    } catch (error) {
        console.log(error);
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
        post.caption = caption;
        await post.save();

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
        const postId = req.params.id;
        const post = await Post.findById(postId);

        // check if there is no post
        if (!post) return res.status(404).json({ message: 'post not found' });

        res.json({ message: 'posts returned', post });
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
            post.likes = post.likes.filter((id) => id != userId);
            user.likedPosts = user.likedPosts.filter((id) => id != postId);
        } else {
            // like post
            post.likes.push(userId);
            user.likedPosts.push(postId);
        }

        await post.save();
        await user.save();

        res.json({ post, likes: post.likes.length, likedPosts: user.likedPosts });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// get user liked posts
async function getLikedPosts(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
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


module.exports = { likePost, createPost, editPost, getPostById, deletePost, getLikedPosts, getPostComments };