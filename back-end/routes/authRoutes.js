const express = require("express");
const { register, verifyOtp, login, logout, forgotPassword, sendOtp, resetPassword } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/forgot-password', forgotPassword);
router.post('send-otp', sendOtp);
router.post('reset-password', resetPassword);



module.exports = router;