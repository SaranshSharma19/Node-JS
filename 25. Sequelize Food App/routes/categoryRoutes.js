const express = require("express");

const authMiddleware = require("../middleware/authMiddleware.js");
const {
    createCatController,
    getAllCatController,
    updateCatController,
    deleteCatController,
    searchCategoryController,
} = require("../controllers/categoryControllers.js");

const router = express.Router();

router.post("/create", authMiddleware, createCatController);
router.get("/getAll", getAllCatController);
router.get("/search", searchCategoryController);
router.put("/update/:id", authMiddleware, updateCatController);
router.delete("/delete/:id", authMiddleware, deleteCatController);

module.exports = router;