const otpGenerator = require("otp-generator");

function generateOtp() {
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    const otpExpires = Date.now() + 3 * 60 * 1000; // OTP valid for 3 minutes
    return { otp, otpExpires };
}

module.exports = { generateOtp };