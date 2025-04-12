const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
    createResturantController,
    getAllResturantController,
    getResturantByIdController,
    deleteResturantController,
    searchResturantController,
} = require("../controllers/resturantController");

const router = express.Router();

router.post("/create", authMiddleware, createResturantController);
router.get("/getAll", getAllResturantController);
router.get("/get/:id", getResturantByIdController);
router.get("/search", searchResturantController);
router.delete("/delete/:id", authMiddleware, deleteResturantController);

module.exports = router;