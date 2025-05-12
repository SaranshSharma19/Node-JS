const { resturant: Restaurant } = require('../config/db.js');

const createResturantController = async (req, res) => {
    try {
        const {
            title,
            imageUrl,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            logoUrl,
            rating,
            ratingCount,
            code,
            coords,
        } = req.body;

        if (!title || !coords) {
            return res.status(400).send({
                success: false,
                message: "Please provide title and coordinates",
            });
        }

        const newResturant = await Restaurant.create({
            title,
            imageUrl,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            logoUrl,
            rating,
            ratingCount,
            code,
            coords,
        });

        res.status(201).send({
            success: true,
            message: "New Restaurant Created successfully",
            newResturant
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Restaurant API",
            error,
        });
    }
};

const getAllResturantController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const offset = (page - 1) * limit;

        const { count, rows } = await Restaurant.findAndCountAll({
            offset,
            limit,
        });

        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No Restaurant Available",
            });
        }

        res.status(200).send({
            success: true,
            totalCount: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            resturants: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Get All Restaurant API",
            error,
        });
    }
};

const getResturantByIdController = async (req, res) => {
    try {
        const resturantId = req.params.id;

        if (!resturantId) {
            return res.status(400).send({
                success: false,
                message: "Please provide Restaurant ID",
            });
        }

        const resturant = await Restaurant.findByPk(resturantId);

        if (!resturant) {
            return res.status(404).send({
                success: false,
                message: "No Restaurant Found",
            });
        }

        res.status(200).send({
            success: true,
            resturant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Get Restaurant By ID API",
            error,
        });
    }
};

const deleteResturantController = async (req, res) => {
    try {
        const resturantId = req.params.id;

        if (!resturantId) {
            return res.status(400).send({
                success: false,
                message: "Please provide Restaurant ID",
            });
        }

        const deletedCount = await Restaurant.destroy({ where: { id: resturantId } });

        if (!deletedCount) {
            return res.status(404).send({
                success: false,
                message: "No Restaurant Found to Delete",
            });
        }

        res.status(200).send({
            success: true,
            message: "Restaurant Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Restaurant API",
            error,
        });
    }
};

const searchResturantController = async (req, res) => {
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

        const { count, rows } = await Restaurant.findAndCountAll({
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
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Search Restaurant API",
            error,
        });
    }
};

module.exports = {
    createResturantController,
    getAllResturantController,
    getResturantByIdController,
    deleteResturantController,
    searchResturantController
};