const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
    createCatController,
    getAllCatController,
    updateCatController,
    deleteCatController,
} = require("../controllers/categoryControllers");

const router = express.Router();

router.post("/create", authMiddleware, createCatController);
router.get("/getAll", getAllCatController);
router.put("/update/:id", authMiddleware, updateCatController);
router.delete("/delete/:id", authMiddleware, deleteCatController);

module.exports = router;