const express = require("express");
const { register, verifyOtp, login, logout, forgotPassword } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/forgot-password', forgotPassword);



module.exports = router;