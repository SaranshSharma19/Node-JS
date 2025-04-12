const express = require("express");
const {
    getUserController,
    updateUserController,
    updatePasswordController,
    resetPasswordController,
    deleteProfileController,
    verifyResetPasswordOtp,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

router.get("/getUser", authMiddleware, getUserController);
router.put("/updateUser", authMiddleware, updateUserController);
router.post("/updatePassword", authMiddleware, updatePasswordController);
router.post("/resetPassword", authMiddleware, resetPasswordController);
router.post("/verify-reset", verifyResetPasswordOtp);
router.delete("/deleteUser/:id", authMiddleware, deleteProfileController);

module.exports = router;