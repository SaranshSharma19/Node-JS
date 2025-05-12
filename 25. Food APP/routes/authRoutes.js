const express = require("express");
const {
    registerController,
    loginController,
    verifyRegistrationOtp,
    verifyLoginOtp,
    logoutUser
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/verify-register", verifyRegistrationOtp);

router.post("/login", loginController);
router.post("/verify-login", verifyLoginOtp);

router.get("/logout", logoutUser);

module.exports = router;