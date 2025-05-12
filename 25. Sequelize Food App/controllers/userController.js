const bcrypt = require("bcryptjs");
const sendOtp = require('../services/otpService.js').sendOtp;
const verifyOtp = require('../services/otpService.js').verifyOtp;
const { user: User, otp: Otp } = require('../config/db.js'); 

const tempPasswordStore = {};

const getUserController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in Get User API", error });
    }
};

const updateUserController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { userName, address, phone, email } = req.body;

        await user.update({
            userName: userName || user.userName,
            address: address || user.address,
            phone: phone || user.phone,
            email: email || user.email,
        });

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in updating user", error });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both old and new password" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({ password: hashedPassword });

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in password update", error });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = await sendOtp(user.userName, email);
        await Otp.create({ email, otp });
        tempPasswordStore["data"] = { email, newPassword };

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in password reset", error });
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
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isValid = await verifyOtp(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({ password: hashedPassword });
        delete tempPasswordStore["data"];

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteProfileController = async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Your account has been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in delete profile API", error });
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
