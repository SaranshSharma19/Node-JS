const { category: Category } = require('../config/db.js');

const createCatController = async (req, res) => {
    try {
        const { title, imageUrl } = req.body;

        if (!title) {
            return res.status(500).send({
                success: false,
                message: "please provide category title or image",
            });
        }
        const newCategory = await Category.create({ title, imageUrl });
        await newCategory.save();
        res.status(201).send({
            success: true,
            message: "category created",
            newCategory,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Create Cat API",
            error,
        });
    }
};

const getAllCatController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const offset = (page - 1) * limit;
        const { count, rows } = await Category.findAndCountAll({
            offset,
            limit,
        });
        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No Categories found",
            });
        }
        res.status(200).send({
            success: true,
            totalCount: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            category: rows,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in get All Categpry API",
            error,
        });
    }
};

const updateCatController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, imageUrl } = req.body;

        const [updatedRowCount, updatedRows] = await Category.update(
            { title, imageUrl },
            {
                where: { id },
                returning: true,
            }
        );
        if (updatedRowCount === 0) {
            return res.status(500).send({
                success: false,
                message: "No Category Found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            data: updatedRows[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in update cat api",
            error,
        });
    }
};

const deleteCatController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(500).send({
                success: false,
                message: "Please provide Category ID",
            });
        }
        const deletedCount = await Category.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).send({
                success: false,
                message: "No Category found to delete",
            });
        }
        res.status(200).send({
            success: true,
            message: "category Deleted succssfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in Dlete Cat APi",
            error,
        });
    }
};

const searchCategoryController = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        if (!searchTerm) {
            return res.status(400).send({
                success: false,
                message: "Please provide a search term",
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const offset = (page - 1) * limit;
        const { count, rows } = await Category.findAndCountAll({
            where: {
                title: {
                    [require('sequelize').Op.iLike]: `%${searchTerm}%`,
                }
            },
            offset,
            limit,
        });

        res.status(200).send({
            success: true,
            totalCount: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            resturants: rows,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Search Category API",
            error,
        });
    }
};

module.exports = {
    createCatController,
    getAllCatController,
    updateCatController,
    deleteCatController,
    searchCategoryController
};