const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");
const otpModel = require("../models/Otp");
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
    const otpEntry = await otpModel.findOne({
        where: {
            email,
            otp,
            createdAt: {
                [Op.gt]: new Date(Date.now() - 5 * 60 * 1000)
            }
        }
    });

    if (otpEntry) {
        await otpModel.destroy({ where: { email, otp } });
        return true;
    }
    return false;
}

module.exports = { sendOtp, verifyOtp }