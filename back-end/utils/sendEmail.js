const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodeMailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to,
            subject,
            text
    });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { sendEmail };