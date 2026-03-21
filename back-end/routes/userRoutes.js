const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
    blockUsers,
    getUserProfile,
    getHomeInfo,
    follow,
    getFollowers,
    getFollowing,
    getUserNotifications,
    editUserProfile,
    getEditUserInfo,
    changePrivacy,
    getUserPrivacy,
    addCloseFriends,
    getMainInfo,
    getCloseFriends
} = require("../controllers/userController");
const { uploads } = require("../utils/uploads");
const router = express.Router();

// get method routes
router.get('/me', authMiddleware, getMainInfo);
router.get('/close-friends', authMiddleware, getCloseFriends);
router.get('/privacy', authMiddleware, getUserPrivacy);
router.get('/', authMiddleware, getHomeInfo);
router.get('/edit-profile-info', authMiddleware, getEditUserInfo);
router.get('/notifications', authMiddleware, getUserNotifications);
router.get('/:id/followers', authMiddleware, getFollowers);
router.get('/:id/following', authMiddleware, getFollowing);
router.get('/:id', authMiddleware, getUserProfile);

// update method routes
router.put("/change-privacy", authMiddleware, changePrivacy);
router.patch(
    '/edit',
    authMiddleware,
    uploads.single('avatar'),
    editUserProfile);
router.put('/block/:id', authMiddleware, blockUsers);
router.put('/follow/:id', authMiddleware, follow);
router.put('/add-close-friends/:id', authMiddleware, addCloseFriends);


module.exports = router;