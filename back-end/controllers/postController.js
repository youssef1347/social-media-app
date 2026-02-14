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
        const postId = req.params.id;

        // get post and check if the post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found' });

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
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'post not found' });

        await Post.deleteOne({ _id: postId });

        res.json({ message: 'post deleted', post });
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
            await post.updateOne({
                $pull: { likes: userId },
            });

            return res.json({ message: "unliked" });
        } else {
            // like post
            await post.updateOne({
                $addToSet: { likes: userId },
            });
        }

        res.json({ message: 'liked' });

    } catch (error) {
        console.log(error);
    }
}

module.exports = { likePost, createPost, editPost };