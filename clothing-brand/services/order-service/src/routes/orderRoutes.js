const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus, updatePaymentStatus, cancelOrder } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');

console.log("Order Routes");

router.post('/create-order', createOrder);
router.get('/user-order/:userId', userMiddleware, getUserOrders);
router.get('/getorderbyid/:id', userMiddleware, getOrderById);
router.put('/status-update/:id/status', authMiddleware, updateOrderStatus);
router.put('/payment-update/:id/payment', authMiddleware, updatePaymentStatus);
router.put('/cancel-order/:id/cancel', userMiddleware, cancelOrder);

module.exports = router;