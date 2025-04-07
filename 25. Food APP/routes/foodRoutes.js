const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
    createFoodController,
    getAllFoodsController,
    getSingleFoodController,
    getFoodByResturantController,
    updateFoodController,
    deleteFoodController,
    placeOrderController,
    orderStatusController,
    getAllOrdersController,
} = require("../controllers/foodControllers");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createFoodController);
router.get("/getAll", getAllFoodsController);
router.get("/get/:id", getSingleFoodController);
router.get("/getByResturant/:id", getFoodByResturantController);
router.put("/update/:id", authMiddleware, updateFoodController);
router.delete("/delete/:id", authMiddleware, deleteFoodController);
router.post("/placeorder", authMiddleware, placeOrderController);

router.post(
    "/orderStatus/:id",
    authMiddleware,
    adminMiddleware,
    orderStatusController
);

router.get(
    "/getAllOrders",
    authMiddleware,
    adminMiddleware,
    getAllOrdersController
);

module.exports = router;