const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getFollowingPosts, getUserProfile, getHomeInfo } = require("../controllers/userController");
const router = express.Router();

router.get('/', authMiddleware, getHomeInfo, getFollowingPosts);
router.get(':id/profile', authMiddleware, getUserProfile);


module.exports = router;