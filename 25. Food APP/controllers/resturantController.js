const resturantModel = require("../models/resturantModel");

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
            return res.status(500).send({
                success: false,
                message: "please provide title and address",
            });
        }
        const newResturant = new resturantModel({
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

        await newResturant.save();

        res.status(201).send({
            success: true,
            message: "New Resturant Created successfully",
            newResturant
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Create Resturant api",
            error,
        });
    }
};

const getAllResturantController = async (req, res) => {
    try {
        const resturants = await resturantModel.find({});
        if (!resturants) {
            return res.status(404).send({
                success: false,
                message: "No Resturant Availible",
            });
        }
        res.status(200).send({
            success: true,
            totalCount: resturants.length,
            resturants,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get ALL Resturat API",
            error,
        });
    }
};

const getResturantByIdController = async (req, res) => {
    try {
        const resturantId = req.params.id;
        if (!resturantId) {
            return res.status(404).send({
                success: false,
                message: "Please Provide Resturant ID",
            });
        }

        const resturant = await resturantModel.findById(resturantId);
        if (!resturant) {
            return res.status(404).send({
                success: false,
                message: "no resturant found",
            });
        }
        res.status(200).send({
            success: true,
            resturant,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get Resturarnt by id api",
            error,
        });
    }
};

const deleteResturantController = async (req, res) => {
    try {
        const resturantId = req.params.id;
        if (!resturantId) {
            return res.status(404).send({
                success: false,
                message: "No Resturant Found OR Provide Resturant ID",
            });
        }
        await resturantModel.findByIdAndDelete(resturantId);
        res.status(200).send({
            success: true,
            message: "Resturant Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror in delete resturant api",
            error,
        });
    }
};

module.exports = {
    createResturantController,
    getAllResturantController,
    getResturantByIdController,
    deleteResturantController,
};