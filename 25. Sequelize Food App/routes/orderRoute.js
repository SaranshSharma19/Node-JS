const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");
const {
    placeOrderController,
    orderStatusController,
    getAllOrdersController,
} = require("../controllers/orderController.js");
const router = express.Router();

router.post("/placeorder", authMiddleware, placeOrderController);
router.post("/orderStatus/:id", authMiddleware, adminMiddleware, orderStatusController)
router.get("/getAllOrders", authMiddleware, adminMiddleware, getAllOrdersController);

module.exports = router;