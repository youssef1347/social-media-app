const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateTokens(user) {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    );


    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { refreshToken, accessToken };
};

module.exports = { generateTokens };
