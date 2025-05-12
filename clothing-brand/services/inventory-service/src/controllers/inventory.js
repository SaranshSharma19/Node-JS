const Inventory = require('../models/Inventory');
const ProductSize = require('../models/ProductSize');
const { Op } = require('sequelize');

const createInventory = async (req, res) => {
    try {
        const { productId, sizes } = req.body;

        if (!productId || !Array.isArray(sizes) || sizes.length === 0) {
            return res.status(400).json({ error: 'productId and sizes are required' });
        }

        const totalStock = sizes.reduce((sum, { stock }) => sum + stock, 0);

        const inventory = await Inventory.create({ productId, totalStock });

        const sizeEntries = sizes.map(({ size, stock }) => ({
            productId,
            size,
            stock
        }));
        await ProductSize.bulkCreate(sizeEntries);

        res.status(201).json({ message: 'Inventory created successfully', inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        const inventory = await Inventory.findOne({ where: { productId } });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const sizes = await ProductSize.findAll({ where: { productId } });

        res.json({ inventory, sizes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        const { sizes } = req.body;

        const inventory = await Inventory.findOne({ where: { productId } });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        if (!Array.isArray(sizes) || sizes.length === 0) {
            return res.status(400).json({ error: 'Sizes are required to update inventory' });
        }

        const totalStock = sizes.reduce((sum, { stock }) => sum + stock, 0);
        await inventory.update({ totalStock });

        await ProductSize.destroy({ where: { productId } });

        const sizeEntries = sizes.map(({ size, stock }) => ({
            productId,
            size,
            stock
        }));
        await ProductSize.bulkCreate(sizeEntries);

        res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size, quantity } = req.body;

        const productSize = await ProductSize.findOne({ where: { productId, size } });

        if (!productSize) {
            return res.status(404).json({ message: 'Product size not found' });
        }

        const newStock = productSize.stock + quantity;
        if (newStock < 0) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        await productSize.update({ stock: newStock });

        const totalStock = await ProductSize.sum('stock', { where: { productId } });
        await Inventory.update({ totalStock }, { where: { productId } });

        res.json({ message: 'Stock updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        await ProductSize.destroy({ where: { productId } });
        const deleted = await Inventory.destroy({ where: { productId } });

        if (!deleted) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.json({ message: 'Inventory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const decrementStock = async (req, res) => {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    try {
        const inventory = await ProductSize.findOne({ where: { size, productId } });

        if (!inventory || inventory.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        inventory.stock -= quantity;
        await inventory.save();

        res.status(200).json({ message: 'Stock decremented successfully', inventory });
    } catch (error) {
        console.error('Failed to decrement stock:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const incrementStock = async (req, res) => {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    try {
        const inventory = await ProductSize.findOne({ where: { size, productId } });

        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }
        inventory.stock += quantity;
        await inventory.save();

        res.status(200).json({ message: 'Stock incremented successfully', inventory });
    } catch (error) {
        console.error('Failed to increment stock:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createInventory,
    getInventory,
    updateInventory,
    updateStock,
    deleteInventory,
    decrementStock,
    incrementStock,
};
