const express = require("express");
const {
    register,
    verifyOtp,
    login,
    logout,
    forgotPassword,
    sendOtp,
    resetPassword,
    generateAccessToken,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/send-otp", sendOtp);
router.post('/generate-access-token', generateAccessToken);
router.put("/reset-password", resetPassword);

module.exports = router;
