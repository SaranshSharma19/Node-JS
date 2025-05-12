import express from 'express';
import { authCaptain } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/captainValidator.js'
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain, changeCaptainStatus, verifyRegistrationOtp, verifyLoginOtp, deleteUser } from '../controllers/captainController.js';

const router = express.Router();

router.post("/register", registerValidator, registerCaptain)
router.post("/verify-registration-otp", verifyRegistrationOtp)

router.post("/login", loginValidator, loginCaptain)
router.post("/verify-login-otp", verifyLoginOtp)

router.put("/status", authCaptain, changeCaptainStatus);
router.get("/profile", authCaptain, getCaptainProfile)
router.get("/logout", authCaptain, logoutCaptain)
router.delete("/delete", authCaptain, deleteUser);

export default router;