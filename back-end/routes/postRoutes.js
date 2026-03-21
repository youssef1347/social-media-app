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
    repost,
    getAllUserPosts,
    getSavedPosts,
    getRepostedPosts,
    savePost,
} = require("../controllers/postController");
const { uploads } = require("../utils/uploads");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const router = express.Router();

// post method routes
router.post(
    "/create-post",
    authMiddleware,
    uploads.array("images"),
    createPost,
);

// get method routes
router.get('/', authMiddleware, getAllUserPosts);
router.get("/liked-posts", authMiddleware, getLikedPosts);
router.get("/saved-posts", authMiddleware, getSavedPosts);
router.get('/reposted-posts', authMiddleware, getRepostedPosts);
router.get("/:id/comments", authMiddleware, getPostComments);
router.get("/:id", authMiddleware, getPostById);


// update method routes
router.put("/like-post/:id", authMiddleware, likePost);
router.patch("/:id/edit", authMiddleware, editPost);
router.put('/:id/repost', authMiddleware, repost);
router.put('/:id/save', authMiddleware, savePost);

// delete method routes
router.delete("/:id/delete", authMiddleware, roleMiddleware, deletePost);

module.exports = router;
