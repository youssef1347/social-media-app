const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
    blockUsers,
    getUserProfile,
    getHomeInfo,
    follow,
    getFollowers,
    getFollowing,
    getUserNotifications
} = require("../controllers/userController");
const router = express.Router();

router.get('/', authMiddleware, getHomeInfo);
router.get(':id/profile', authMiddleware, getUserProfile);
router.get('/notifications', authMiddleware, getUserNotifications);
router.put('/block/:id', authMiddleware, blockUsers);
router.put('/follow/:id', authMiddleware, follow);
router.get('/:id/followers', authMiddleware, getFollowers);
router.get('/:id/following', authMiddleware, getFollowing);


module.exports = router;