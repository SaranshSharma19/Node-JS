const Cart = require('../models/Cart.js');
const CartItem = require('../models/CartItem.js');
const getOrCreateCart = require('../utils/getorCreateCart.js');
const axios = require('axios');
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4003';

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    console.log('Adding to cart:', productId, quantity, size);

    if (!productId || !size) {
      return res.status(400).json({ error: 'productId and size are required' });
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    let product;
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/product/${productId}`);
      product = response.data;
    } catch (err) {
      return res.status(404).json({ error: 'Product not found in product service' });
    }

    let inventoryStock;
    try {
      const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/api/inventory/get/${productId}`);
      const sizeInventory = inventoryResponse.data.sizes.find(s => s.size === size);
      inventoryStock = sizeInventory ? sizeInventory.stock : 0;
    } catch (err) {
      return res.status(500).json({ error: 'Error fetching inventory data' });
    }

    if (inventoryStock === 0) {
      return res.status(400).json({ error: `Size ${size} is out of stock` });
    }

    if (quantityNum > inventoryStock) {
      return res.status(400).json({ error: `Only ${inventoryStock} items available in stock for size ${size}` });
    }

    const cart = await getOrCreateCart(req.user.id);
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId, size } });
    const alreadyInCart = item ? item.quantity : 0;

    if (quantityNum + alreadyInCart > inventoryStock) {
      return res.status(400).json({ error: `Only ${inventoryStock - alreadyInCart} more items available in stock for size ${size}` });
    }

    if (item) {
      item.quantity += quantityNum;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity: quantityNum, size });
    }

    res.status(201).json({ message: 'Product added to cart', item });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const deleted = await CartItem.destroy({ where: { cartId: cart.id, productId } });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    if (quantity === undefined && !size) {
      return res.status(400).json({ error: 'At least one of quantity or size must be provided' });
    }

    let quantityNum;
    if (quantity !== undefined) {
      quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive number' });
      }
    }

    const cart = await getOrCreateCart(req.user.id);

    const item = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    let newSize = item.size;

    if (size) {
      let product;
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/product/${productId}`);
        product = response.data;
      } catch (err) {
        return res.status(404).json({ error: 'Product not found in product service' });
      }

      let inventoryStock;
      try {
        const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/api/inventory/get/${productId}`);
        const sizeInventory = inventoryResponse.data.sizes.find(s => s.size === size);
        inventoryStock = sizeInventory ? sizeInventory.stock : 0;
      } catch (err) {
        return res.status(500).json({ error: 'Error fetching inventory data' });
      }

      if (quantityNum !== undefined && quantityNum > inventoryStock) {
        return res.status(400).json({ error: `Only ${inventoryStock} items available in stock for size ${size}` });
      }

      const duplicateItem = await CartItem.findOne({
        where: { cartId: cart.id, productId, size }
      });

      if (duplicateItem && duplicateItem.id !== item.id) {
        return res.status(409).json({ error: 'Product with selected size already exists in cart' });
      }

      newSize = size;
    }

    if (quantityNum !== undefined) item.quantity = quantityNum;
    if (size) item.size = newSize;

    await item.save();

    res.json({ message: 'Cart item updated', item });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

    const itemsWithProducts = await Promise.all(cartItems.map(async (item) => {
      try {
        const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/product/${item.productId}`);
        const product = productResponse.data;

        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: product
        };
      } catch (error) {
        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: null
        };
      }
    }));

    res.json({
      cartId: cart.id,
      items: itemsWithProducts,
      itemCount: itemsWithProducts.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
};
