const { Post } = require("../models/posts");
const { User } = require("../models/users");
const { commentSchema } = require("../validation/commentValidation");



// comment on post function
async function comment(req, res) {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'post not found' });

        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(401).json({ message: 'Unauthorized' });;

        const { error, value } = commentSchema.validate(req.body, { abortEarly: false });

        if (error) return res.status(400).json({ message: error.details.map((err) => err.message) });

        const { commentText } = value;

        await Comment.create({
            commentText,
            postId,
            userId,
        });

        res.status(201).json({ message: 'comment created' });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { comment };