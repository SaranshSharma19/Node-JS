const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerController, loginController, googleController, getAllUsers, getSingleUser, updateUser, deleteUser, completeProfile, verifyRegistrationOtp, verifyLoginOtp, refreshTokenUser, logoutUser } = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');
const RefreshToken = require('../models/RefreshToken.js');

router.post('/register', registerController);
router.post('/verify-register', verifyRegistrationOtp);
router.post('/login', loginController);
router.post('/verify-login', verifyLoginOtp);
router.post('/refresh-token', refreshTokenUser)
router.post('/logout', logoutUser);
router.post('/checkToken/:token', async (req, res) => {
    const token = req.params.token;
    if (!token) {
        return res.status(400).json({ valid: false, message: 'No token provided' });
    }
    const valid = await RefreshToken.findOne({ where: { token } });

    if (!valid) {
        return res.status(401).json({ valid: false, message: 'Invalid token' });
    }

    console.log("Valid", valid);
    return res.status(200).json({ valid: true, message: 'Token is valid' });
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleController);
router.get('/failure', (req, res) => res.send('Google auth failed'));
router.post('/complete-profile', userMiddleware, completeProfile);

router.get('/users', userMiddleware, adminMiddleware, getAllUsers);
router.get('/user/:userId', userMiddleware, adminMiddleware, getSingleUser);
router.put('/update-user/:userId', userMiddleware, adminMiddleware, updateUser);
router.delete('/delete-user/:userId', userMiddleware, adminMiddleware, deleteUser);

module.exports = router;