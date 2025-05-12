import nodemailer from "nodemailer";
import crypto from "crypto";
import otpModel from "../models/otpModel.js";

export const sendOtp = async (fullname, email) => {
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
        text: ` Hello ${fullname.firstname} ${fullname.lastname},
        
        Your OTP code is ${otp}.
        
        If you didn’t ask to verify this address, you can ignore this message.
        
        Thanks,`,
    });
    return otp;
}

export const resendOtp = async (fullname, email) => {
    const otp = await sendOtp(fullname, email);
    await otpModel.create({ email, otp });
    return otp;
}

export const verifyOtp = async (email, otp) => {
    const otpEntry = await otpModel.findOne({ email, otp });
    if (otpEntry) {
        await otpModel.deleteOne({ email, otp });
        return true;
    }
    return false;
} 