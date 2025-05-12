const Cart = require('../models/Cart.js');

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        cart = await Cart.create({ userId });
    }
    return cart;
};

module.exports = getOrCreateCart;