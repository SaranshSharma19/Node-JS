const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const sendOtp = require('../services/otpService.js').sendOtp;
const verifyOtp = require('../services/otpService.js').verifyOtp;
const { user: User, otp: Otp } = require('../config/db.js');

const tempUserStore = {};

const registerController = async (req, res) => {
    try {
        const { userName, email, password, phone, address, usertype } = req.body;

        if (!userName || !email || !password || !address || !phone) {
            return res.status(400).send({
                success: false,
                message: "Please Provide All Fields",
            });
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).send({
                success: false,
                message: "Email Already Registered, please Login",
            });
        }

        const otp = await sendOtp(userName, email);
        await Otp.create({ email, otp });

        tempUserStore["data"] = { email, userName, password, phone, address, usertype };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error: error.message,
        });
    }
};

const verifyRegistrationOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userData = tempUserStore["data"];

        if (!userData) {
            return res.status(400).json({ message: "User data not found" });
        }

        const { email, userName, password, phone, address, usertype } = userData;

        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            address,
            phone,
            usertype
        });

        delete tempUserStore["data"];

        return res.status(201).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Provide Email Or Password",
            });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const otp = await sendOtp(user.userName, email);
        await Otp.create({ email, otp });
        tempUserStore["data"] = { email };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Login API",
            error: error.message,
        });
    }
};

const verifyLoginOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userData = tempUserStore["data"];

        if (!userData) {
            return res.status(400).json({ message: "User data not found" });
        }

        const { email } = userData;
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const user = await User.findOne({ where: { email } });

        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token);

        delete tempUserStore["data"];

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { 
    registerController, 
    loginController, 
    verifyRegistrationOtp, 
    verifyLoginOtp, 
    logoutUser 
};
