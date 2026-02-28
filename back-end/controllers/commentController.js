const { Comment } = require("../models/comments");
const { Notification } = require("../models/notifications");
const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { commentSchema } = require("../validation/commentValidation");


// create comment function
async function createComment(req, res) {
    try {
        // get post by id
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found' });

        const userId = req.user.id;

        const { error, value } = commentSchema.validate(req.body, { abortEarly: false });

        if (error) return res.status(400).json({ message: error.details.map((err) => err.message) });

        const { commentText } = value;

        // create comment
        const comment = await Comment.create({
            commentText,
            postId,
            userId,
        });

        // create notification for post owner
        const postOwner = await User.findById(post.userId);
        if (postOwner._id != userId) {
            await Notification.create({
                type: 'commentOnYourPost',
                sender: userId,
                user: post.userId,
                post: postId,
                comment: comment._id,
            });
        }

        res.status(201).json({ message: 'comment created', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// edit comment
async function editComment(req, res) {
    try {
        const { commentText } = req.body;
        const commentId = req.params.id;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ message: 'comment not found' });

        if (comment.userId != userId) return res.status(403).json({ message: 'you cannot edit this comment' });

        // update comment
        comment.commentText = commentText;
        await comment.save();

        res.json({ message: 'comment updated', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// delete comment
async function deleteComment(req, res) {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ message: 'comment not found' });

        if (comment.userId != userId) return res.status(403).json({ message: 'you cannot delete this comment' });

        await Comment.deleteOne({ _id: commentId });

        res.json({ message: 'comment deleted', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


// like comment
async function likeComment(req, res) {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ message: 'comment not found' });

        // check if the user already liked the comment
        const isLiked = comment.likes.includes(userId);
        if (isLiked) {
            // comment.likes = comment.likes.filter((id) => id != userId);
            await comment.updateOne({
                $pull: { likes: userId },
            });
            // await comment.save();
            res.json({ message: 'unliked comment' });
        }

        // like comment
        comment.likes.push(userId);
        await comment.updateOne({
            $push: { likes: userId },
        });

        // create notification for comment owner
        if (comment.userId != userId) { 
            await Notification.create({
                type: 'likedComment',
                sender: userId,
                user: comment.userId,
                comment: commentId,
                post: comment.postId,
            });
        }
        res.json({ message: 'comment liked and notification sent', comment, likes: comment.likes.length });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = { createComment, editComment, deleteComment, likeComment };