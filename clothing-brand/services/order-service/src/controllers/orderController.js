const { request } = require('express');
const Order = require('../models/Order.js');
const OrderItem = require('../models/OrderItem.js');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4000';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:4002';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4003';

const createOrder = async (req, res) => {
    const { userId, items, shippingAddressId, paymentMethod } = req.body;
    try {
        console.log(`${USER_SERVICE_URL}/auth/user/${userId}`)
        const userResponse = await axios.get(`${USER_SERVICE_URL}/auth/user/${userId}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        if (!userResponse.data) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User');
        const order = await Order.create({
            userId,
            totalAmount: 0,
            status: 'pending',
            shippingAddressId,
            paymentMethod,
            paymentStatus: 'pending'
        });
        console.log('Order:');

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/product/${item.productId}`);
            const product = productResponse.data;

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }

            const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/api/inventory/get/${item.productId}`);
            const inventory = inventoryResponse.data;
            console.log('Inventory:', inventory);
            if (!inventory || inventory.totalStock < item.quantity) {
                return res.status(400).json({
                    error: 'Insufficient stock',
                    productId: item.productId,
                    requested: item.quantity,
                    available: inventory ? inventory.totalStock : 0
                });
            }

            const orderItem = await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
                price: product.price
            });

            orderItems.push(orderItem);
            totalAmount += orderItem.price * orderItem.quantity;
            await axios.put(`${INVENTORY_SERVICE_URL}/api/inventory/${item.productId}/decrement`, {
                size: item.size,
                quantity: item.quantity
            });
        }

        await order.update({ totalAmount });
        res.status(201).json({
            message: 'Order created successfully',
            order: {
                ...order.toJSON(),
                items: orderItems
            }
        });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, as: 'items' }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Failed to fetch user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: 'items' }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Failed to fetch order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.update({ status });

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Failed to update order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, transactionId } = req.body;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.update({ paymentStatus, transactionId });

        res.status(200).json({ message: 'Payment status updated', order });
    } catch (error) {
        console.error('Failed to update payment status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const cancelOrder = async (req, res) => {
    const { id } = req.params;
    console.log('Cancel Order ID:', id);
    try {
        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: 'items' }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status === 'delivered' || order.status === 'completed') {
            return res.status(400).json({ error: 'Cannot cancel a completed or delivered order' });
        }

        for (const item of order.items) {
            await axios.put(`${INVENTORY_SERVICE_URL}/api/inventory/${item.productId}/increment`, {
                size: item.size,
                quantity: item.quantity
            });
        }

        await order.update({
            status: 'canceled',
            paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'failed'
        });

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Failed to cancel order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
};