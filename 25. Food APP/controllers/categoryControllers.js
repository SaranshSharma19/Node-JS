const categoryModel = require("../models/categoryModel");

const createCatController = async (req, res) => {
    try {
        const { title, imageUrl } = req.body;

        if (!title) {
            return res.status(500).send({
                success: false,
                message: "please provide category title or image",
            });
        }
        const newCategory = new categoryModel({ title, imageUrl });
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
        const skip = (page - 1) * limit;
        const totalCount = await categoryModel.countDocuments();
        const categories = await categoryModel.find({}).skip(skip).limit(limit);
        if (!categories) {
            return res.status(404).send({
                success: false,
                message: "No Categories found",
            });
        }
        res.status(200).send({
            success: true,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            categories,
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
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { title, imageUrl },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(500).send({
                success: false,
                message: "No Category Found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
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
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(500).send({
                success: false,
                message: "No Category Found With this id",
            });
        }
        await categoryModel.findByIdAndDelete(id);
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
        const skip = (page - 1) * limit;
        const category = await categoryModel.find({
            title: { $regex: searchTerm, $options: "i" }
        }).skip(skip).limit(limit);
        const totalCount = await categoryModel.countDocuments({
            title: { $regex: searchTerm, $options: "i" }
        });

        res.status(200).send({
            success: true,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            category,
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