import captainModel from "../models/captainModel.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captainService.js";

export const registerCaptain = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }

        const { fullname, email, password, vehicles, status } = req.body;

        const isCaptainAlreadyExists = await captainModel.findOne({ email });
        if (isCaptainAlreadyExists) {
            return res.status(400).json({ message: "Captain already exists" });
        }

        const hashPassword = await captainModel.hashPassword(password);

        const captain = await createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashPassword,
            color: vehicles.color,
            plate: vehicles.plate,
            capacity: vehicles.capacity,
            vehicleType: vehicles.vehicleType,
            status,
        })

        const token = captain.generateAuthToken();
        return res.status(201).json({ token, captain })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
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
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = captain.generateAuthToken();
        res.cookie("token", token);
        captain.password = undefined;

        res.status(200).json({ token, captain })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
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