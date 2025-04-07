import express from 'express';
import { authCaptain } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/captainValidator.js'
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain, changeCaptainStatus } from '../controllers/captainController.js';

const router = express.Router();

router.post("/register", registerValidator, registerCaptain)

router.post("/login", loginValidator, loginCaptain)

router.put("/status", authCaptain, changeCaptainStatus);

router.get("/profile", authCaptain, getCaptainProfile)

router.get("/logout", authCaptain, logoutCaptain)

export default router;