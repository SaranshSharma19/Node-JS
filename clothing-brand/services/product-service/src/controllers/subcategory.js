const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

const createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name || !categoryId) return res.status(400).json({ error: 'Name and categoryId are required' });

        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const subCategory = await SubCategory.create({ name, categoryId });
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: subCategories } = await SubCategory.findAndCountAll({
            include: Category,
            offset,
            limit: parseInt(limit)
        });

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            subCategories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id, {
            include: Category
        });
        if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });

        res.json(subCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;
        if (!name || !categoryId) return res.status(400).json({ error: 'Name and categoryId are required' });

        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });

        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        await subCategory.update({ name, categoryId });
        res.json({ message: 'SubCategory updated', subCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubCategoriesByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const subCategories = await SubCategory.findAll({
            where: { categoryId }
        });

        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });

        await subCategory.destroy();
        res.json({ message: 'SubCategory deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    getSubCategoriesByCategoryId,
    updateSubCategory,
    deleteSubCategory
};