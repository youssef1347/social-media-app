const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createComment, editComment, deleteComment, likeComment } = require("../controllers/commentController");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post('/:id/create-comment', authMiddleware, createComment);
router.put('/:id/edit', authMiddleware, editComment);
router.delete('/:id/delete', authMiddleware, roleMiddleware, deleteComment);
router.put('/:id/like', authMiddleware, likeComment);

module.exports = router;