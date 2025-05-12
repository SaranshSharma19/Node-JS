import { validationResult } from "express-validator";
import userModel from "../models/userModel.js"
import { createUser } from "../services/userService.js";
import { sendOtp, verifyOtp } from "../services/otpService.js";
import otpModel from "../models/otpModel.js";

const tempUserStore = {};

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await userModel.hashPassword(password);

        const otp = await sendOtp(fullname, email);
        await otpModel.create({ email, otp });
        tempUserStore["data"] = { email, fullname, password };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const verifyRegistrationOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userData = tempUserStore["data"];
        if (!userData) {
            return res.status(400).json({ message: "User data not found" });
        }
        const { email, fullname, password } = userData;
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();
        delete tempUserStore["data"];

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = await sendOtp(user.fullname, email);
    await otpModel.create({ email, otp });
    tempUserStore["data"] = { email };

    return res.status(200).json({ message: "OTP sent to your email" });
}

export const verifyLoginOtp = async (req, res) => {
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

        const user = await userModel.findOne({ email }).select("+password");

        const token = user.generateAuthToken();

        res.cookie("token", token);
        delete tempUserStore["data"];

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

export const logoutUser = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" })
}


export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};