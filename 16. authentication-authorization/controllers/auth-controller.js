const User = require('../model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register controller 
const registerUser = async (req, res) => {
    try {
        // extract user infromation from request body
        const { username, email, password, role } = req.body;

        // check if user is already in our database
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists either with same username or email. Please try with a different username or email.'
            })
        }
        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user and save it to a database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })
        await newlyCreatedUser.save();
        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User Registered Successfully!'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Unable to Register User'
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!',
        })
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // find if the current user exists in the database or not
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User doesn't exists",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(500).json({
                success: false,
                message: 'Invalid Credentials!',
            });
        }

        // create user token (bearer token)
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        })

        res.status(200).json({
            success: true,
            message: 'Logged In Successfully',
            accessToken
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!',
        })
    }
}

// Change Password
const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId

        // extract old and new password
        const { oldPassword, newPassword} = req.body;

        const user = await User.findById(userId);
        if(!user){
            res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }

        // check if old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(500).json({
                success: false,
                message: 'Old Password iss not correct! Please Try Again.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = newHashedPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password Changed Successfully',
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!',
        })
    }
}

module.exports = { registerUser, loginUser, changePassword }