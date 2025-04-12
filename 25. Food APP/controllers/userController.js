const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const otpModel = require("../models/otpModel.js");
const sendOtp = require('../services/otpService.js').sendOtp;
const verifyOtp = require('../services/otpService.js').verifyOtp;


const tempPasswordStore = {};
const getUserController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.id });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "User get Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror in Get User API",
            error,
        });
    }
};

const updateUserController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.id });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "user not found",
            });
        }

        const { userName, address, phone, email } = req.body;
        if (userName) user.userName = userName;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (email) user.email = email;

        await user.save();

        res.status(200).send({
            success: true,
            message: "User Updated Successfully",
            user
        });
    } catch (error) {
        console.log(erorr);
        res.status(500).send({
            success: false,
            message: "Error In Udpating User API",
            error,
        });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.id });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usre Not Found",
            });
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Old or New Password",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid old password",
            });
        }

        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated!",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Password Update API",
            error,
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please Privide All Fields",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found",
            });
        }

        const otp = await sendOtp(user.userName, email);
        await otpModel.create({ email, otp });
        tempPasswordStore["data"] = { email, newPassword };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror In PASSWORD RESET API",
            error,
        });
    }
};

const verifyResetPasswordOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userData = tempPasswordStore["data"];
        if (!userData) {
            return res.status(400).json({ message: "User data not found" });
        }
        const { email, newPassword } = userData;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found",
            });
        }
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteProfileController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Your account has been deleted",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr In Delete Profile API",
            error,
        });
    }
};

module.exports = {
    getUserController,
    updateUserController,
    updatePasswordController,
    resetPasswordController,
    verifyResetPasswordOtp,
    deleteProfileController,
};