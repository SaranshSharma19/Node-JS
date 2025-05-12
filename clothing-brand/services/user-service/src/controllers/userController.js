const User = require('../models/User');
const Address = require('../models/Address');
const ContactDetail = require('../models/Contact');
const Otp = require('../models/Otp');
const Token = require('../models/Token');
const RefreshToken = require('../models/RefreshToken');
const { sendOtp, verifyOtp } = require('../utils/otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const tempUserStore = {};
const registerController = async (req, res) => {
    try {
        const { name, email, password, address, contact, authType, userType } = req.body;

        if (!name || !email || !password || !address || !contact) {
            return res.status(400).json({ error: 'All fields are required.' });
        }


        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const otp = await sendOtp(name, email);
        await Otp.create({ email, otp });

        tempUserStore["data"] = { name, email, password, address, contact, authType, userType };
        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
}


const verifyRegistrationOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userData = tempUserStore["data"];

        if (!userData) {
            return res.status(400).json({ message: "User data not found" });
        }

        const { name, email, password, address, contact, authType, userType } = userData;
        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, authType, userType });

        await Address.create({
            userId: user.id,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country
        });

        await ContactDetail.create({
            userId: user.id,
            phone: contact.phone
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
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.authType === 'google') {
            return res.status(400).json({
                error: 'This account uses Google authentication. Please login with Google.'
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const otp = await sendOtp(user.userName, email);
        await Otp.create({ email, otp });
        tempUserStore["data"] = { email };

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
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
        const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '5h' });
        const refreshToken = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await RefreshToken.create({
            token,
            refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        user.password = undefined;
        res.cookie("token", token);

        delete tempUserStore["data"];

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user,
            token,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleController = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/auth/failure' }, async (err, user, info) => {
        try {
            if (err) return next(err);
            if (!user) return res.redirect('/auth/failure');

            req.login(user, async (loginErr) => {
                if (loginErr) return next(loginErr);

                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

                const hasProfile = await Address.findOne({ where: { userId: user.id } });

                if (!hasProfile) {
                    return res.json({
                        message: 'Google authentication successful. Please complete your profile.',
                        userId: user.id,
                        token,
                        refreshToken,
                        requiresProfile: true
                    });
                }

                res.json({
                    message: 'Google authentication successful',
                    userId: user.id,
                    token,
                    refreshToken
                });
            });
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect('/auth/failure');
        }
    })(req, res, next);
};

const refreshTokenUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        const storedToken = await RefreshToken.findOne({ where: { refreshToken: refreshToken } });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: `Invalid or expired refresh token`,
            });
        }

        const user = await User.findByPk(storedToken.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User not found`,
            });
        }

        const payload = { id: user.id, userType: user.userType }

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '5h',
        });
        const token = await Token.findOne({ where: { userId: user.id } });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await RefreshToken.update(
            { token: newAccessToken, refreshToken: newRefreshToken, expiresAt },
            { where: { id: storedToken.id }, new: true });
        res.clearCookie("token");
        res.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token missing",
            });
        }
        await RefreshToken.destroy({ where: { refreshToken: refreshToken } });
        res.clearCookie("token");
        res.json({
            success: true,
            message: "Logged out successfully!",
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const completeProfile = async (req, res) => {
    try {
        const { address, contact } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Address.create({
            userId,
            ...address
        });

        await ContactDetail.create({
            userId,
            phone: contact.phone
        });

        res.json({ message: 'Profile completed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to complete profile' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: users } = await User.findAndCountAll({
            include: [
                { model: Address },
                { model: ContactDetail }
            ],
            attributes: { exclude: ['password'] },
            offset,
            limit
        });

        res.json({
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                { model: Address },
                { model: ContactDetail }
            ],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, userType, address, contact } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            userType: userType || user.userType
        });

        if (address) {
            await Address.update(address, {
                where: { userId }
            });
        }

        if (contact && contact.phone) {
            await ContactDetail.update({
                phone: contact.phone
            }, {
                where: { userId }
            });
        }

        const updatedUser = await User.findByPk(userId, {
            include: [
                { model: Address },
                { model: ContactDetail }
            ],
            attributes: { exclude: ['password'] }
        });

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Address.destroy({ where: { userId } });
        await ContactDetail.destroy({ where: { userId } });
        await user.destroy();

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    registerController,
    verifyRegistrationOtp,
    loginController,
    verifyLoginOtp,
    googleController,
    completeProfile,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    refreshTokenUser,
    logoutUser
};
