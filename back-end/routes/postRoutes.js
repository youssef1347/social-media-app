const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
    createPost,
    likePost,
    getPostById,
    editPost,
    deletePost,
    getLikedPosts,
    getPostComments,
} = require("../controllers/postController");
const { uploads } = require("../utils/uploads");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post(
    "/create-post",
    uploads.array("images"),
    authMiddleware,
    createPost,
);
router.post("/like-post/:id", authMiddleware, likePost);
router.get("/:id", authMiddleware, getPostById);
router.patch("/:id/edit", authMiddleware, editPost);
router.delete("/:id/delete", authMiddleware, roleMiddleware, deletePost);
router.get("/liked-posts", authMiddleware, getLikedPosts);
router.get("/:id/comments", authMiddleware, getPostComments);

module.exports = router;
