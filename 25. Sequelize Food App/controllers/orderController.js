const { order: Order, user: User, food: Food, OrderFoods } = require('../config/db.js');

const placeOrderController = async (req, res) => {
    try {
        const { cart, id: buyerId } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Please add food to cart.",
            });
        }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const newOrder = await Order.create({
            payment: { total },
            buyerId,
        });
        const foodIds = cart.map(item => item.id);
        await newOrder.setFoods(foodIds);

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            newOrder,
        });
    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).send({
            success: false,
            message: "Error in place order API",
            error,
        });
    }
};

const orderStatusController = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId)
        if (!orderId) {
            return res.status(404).send({
                success: false,
                message: "Please provide valid order id",
            });
        }

        const { status } = req.body;
        console.log(status)
        if (!status || !["Preparing", "Pick up", "On the way", "Delivered"].includes(status)) {
            return res.status(400).send({
                success: false,
                message: "Please provide valid status",
            });
        }

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }

        order.status = status;
        await order.save();

        res.status(200).send({
            success: true,
            message: "Order Status Updated",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Order Status API",
            error,
        });
    }
};

const getAllOrdersController = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'buyer',
                },
                {
                    model: Food,
                    as: 'foods',
                }
            ]
        });

        if (!orders || orders.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No orders found",
            });
        }

        res.status(200).send({
            success: true,
            totalOrders: orders.length,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get ALL Orders API",
            error,
        });
    }
};

module.exports = {
    placeOrderController,
    orderStatusController,
    getAllOrdersController
};