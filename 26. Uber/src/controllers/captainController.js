import captainModel from "../models/captainModel.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captainService.js";
import { sendOtp, verifyOtp } from "../services/otpService.js";
import otpModel from "../models/otpModel.js";

const tempCaptainStore = {};

export const registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicles, status } = req.body;

        const isCaptainAlreadyExists = await captainModel.findOne({ email });
        if (isCaptainAlreadyExists) {
            return res.status(400).json({ message: "Captain already exists" });
        }

        const otp = await sendOtp(fullname, email);
        await otpModel.create({ email, otp });

        tempCaptainStore["data"] = { email, fullname, vehicles, password, status };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyRegistrationOtp = async (req, res) => {
    try {

        const { otp } = req.body;
        const captainData = tempCaptainStore["data"];
        if (!captainData) {
            return res.status(400).json({ message: "Captain data not found" });
        }
        const { email, fullname, vehicles, password, status } = captainData;
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicles.color,
            plate: vehicles.plate,
            capacity: vehicles.capacity,
            vehicleType: vehicles.vehicleType,
            status,
        });

        const token = captain.generateAuthToken();
        delete tempCaptainStore["data"];

        res.status(201).json({ captain, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(400).json({ message: "Captain not found" })
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const otp = await sendOtp(captain.fullname, email);
        await otpModel.create({ email, otp });
        tempCaptainStore["data"] = { email };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const verifyLoginOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const captainData = tempCaptainStore["data"];
        if (!captainData) {
            return res.status(400).json({ message: "Captain data not found" });
        }
        const { email } = captainData;
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const captain = await captainModel.findOne({ email }).select("+password");

        const token = captain.generateAuthToken();

        res.cookie("token", token);
        delete tempCaptainStore["data"];

        res.status(200).json({ captain, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const changeCaptainStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const captainId = req.captain._id;
        if (!captainId) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const captain = await captainModel.findByIdAndUpdate(
            captainId,
            { status },
            { new: true }
        );

        res.status(200).json({
            message: "Status updated successfully",
            captain,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain })
}

export const logoutCaptain = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" })
}

export const deleteUser = async (req, res) => {
    try {
        console.log(req.captain)
        const captainId = req.captain._id

        const captain = await captainModel.findById(captainId);
        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        await captainModel.findByIdAndDelete(captainId);

        res.status(200).json({ message: "Captain deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};