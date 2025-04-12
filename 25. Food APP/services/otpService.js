const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpModel = require("../models/otpModel.js");

const sendOtp = async (fullname, email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    await transporter.sendMail({
        to: email,
        subject: "Your OTP Code",
        text: ` Hello ${fullname},
        
    Your OTP code is ${otp}.
        
    If you didn’t ask to verify this address, you can ignore this message.
        
    Thanks,
    Node Team
    `,
    });
    return otp;
}

const verifyOtp = async (email, otp) => {
    const otpEntry = await otpModel.findOne({ email, otp });
    if (otpEntry) {
        await otpModel.deleteOne({ email, otp });
        return true;
    }
    return false;
}

module.exports = { sendOtp, verifyOtp }