const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { User } = require("../models/users");
const { registerSchema, verifyOtpSchema, loginSchema } = require("../validation/userValidation");
const { sendEmail } = require("../utils/sendEmail");
const { generateTokens } = require("../utils/generateToken");
const { generateOtp } = require("../utils/otpGenerator");
dotenv.config();


async function register(req, res) {
    try {
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map((err) => err.message) });
        };

        //check if this email already exists
        const existUser = await User.findOne({ email: value.email });

        if (existUser) {
            return res.status(400).json({ message: 'this email already exists' });
        };

        //hashing password
        const hashedPass = await bcrypt.hash(value.password, 8);


        //creating user in db
        const user = await User.create({
            email: value.email,
            password: hashedPass,
            username: value.username,
        });


        res.status(201).json({
            message: 'user created, verify your email',
            username: user.username,
            email: user.email
        });


    } catch (error) {
        console.log(error);
    }
}


async function sendOtp(req, res) {
    try {
        const { email } = req.body;

        // find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'user with this email does not exist' });
        }

        // generate otp
        const { otp, otpExpires } = generateOtp();

        // store otp and otpExpires in the user document
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();


        // send otp in the email
        await sendEmail(
            user.email,
            'verification otp',
            `the otp ${otp}`,
        );

        res.status(200).json({ message: 'otp sent to your email' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}


async function verifyOtp(req, res) {
    try {
        const { error, value } = verifyOtpSchema.validate(req.body, { abortEarly: false });

        //handling error
        if (error) {
            return res.json({ message: error.details.map((err) => err.message) });
        }

        const { otp, email } = value;

        //find the user
        const user = await User.findOne({ email });

        //check if the otp expired or invalid
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'invalid otp or expired' });
        }

        // verify the email
        user.isVerified = true;

        // delete the otp
        user.otp = undefined;
        user.otpExpires = undefined;

        // save the user
        await user.save();


        // generate access and refresh tokens
        const { refreshToken, accessToken } = generateTokens(user);

        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.PRODUCTION,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: 'email verified', accessToken });
    } catch (error) {
        console.log(error);
        
    }
}


async function login(req, res) {
    try {
        const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

        // handling error
        if (error) {
            return res.status(400).json({ message: error.details.map((err) => err.message) });
        };

        const { email, password } = value;

        // find the user
        const user = await User.findOne({ email });

        // check if the email and password are correct
        if (!user) {
            return res.status(400).json({ message: 'invalid email or password' });
        }

        // check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'invalid email or password' });
        }

        // check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'verify your email first', email: user.email });
    }


        // generate access and refresh tokens
        const { refreshToken, accessToken } = generateTokens(user);

        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.PRODUCTION === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: 'logged in successfully',
            accessToken,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.log(error);
    }
}


async function logout(req, res) {
    try {
        // clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true, 
            secure: process.env.PRODUCTION === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'logged out successfully', id: req.user.id });
    } catch (error) {
        console.log(error); 
        
    }
}


async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        // find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'user with this email does not exist' });
        }

        // generate reset link
        const resetLink = crypto.randomBytes(32).toString('hex');

        // store reset link in the user document
        user.resetLink = resetLink;
        user.resetLinkExpires = Date.now() + 5 * 60 * 1000; // 1 hour
        await user.save();

        // send reset link in the email
        await sendEmail(
            user.email,
            'password reset link',
            `the password reset link is ${resetLink}`,
        );

    } catch (error) {
        console.log(error);
    }
}


async function resetPassword(req, res) {
    try {
        
    } catch (error) {
        console.log(error);
    }
}


module.exports = { register, verifyOtp, login, logout, forgotPassword, sendOtp, resetPassword };