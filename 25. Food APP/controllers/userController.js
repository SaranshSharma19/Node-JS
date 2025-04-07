const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
                message: "Please Provide Old or New PasswOrd",
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
        const { email, newPassword, answer } = req.body;
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: "Please Privide All Fields",
            });
        }
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found",
            });
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
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror In PASSWORD RESET API",
            error,
        });
    }
};

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
    deleteProfileController,
};