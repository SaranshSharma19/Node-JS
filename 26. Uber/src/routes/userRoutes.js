import express from "express";
import { loginValidator, registerValidator } from "../validators/userValidator.js";
import { registerUser, loginUser, getUserProfile, logoutUser, verifyRegistrationOtp, verifyLoginOtp, deleteUser } from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser)
router.post("/verify-registration-otp", verifyRegistrationOtp)

router.post("/login", loginValidator, loginUser)
router.post("/verify-login-otp", verifyLoginOtp)

router.get("/profile", authUser, getUserProfile)
router.get("/logout", authUser, logoutUser)
router.delete("/delete", authUser, deleteUser);

export default router;