const { food: Food, resturant: Restaurant, category: Category } = require('../config/db.js');

const createFoodController = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            imageUrl,
            foodTags,
            categoryId,
            code,
            isAvailable,
            restaurantId,
            rating,
        } = req.body;

        if (!title || !description || !price || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const newFood = await Food.create({
            title,
            description,
            price,
            imageUrl,
            foodTags,
            categoryId,
            code,
            isAvailable,
            restaurantId,
            rating,
        });

        res.status(201).json({
            success: true,
            message: "New Food Item Created",
            newFood,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in create food API",
            error,
        });
    }
};

const getAllFoodsController = async (req, res) => {
    try {
        const foods = await Food.findAll({
            include: [{
                model: Restaurant,
                as: 'restaurant',
            },
            {
                model: Category,
                as: 'category',
            }]

        });

        res.status(200).json({
            success: true,
            totalFoods: foods.length,
            foods,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in get all foods API",
            error,
        });
    }
};

const getSingleFoodController = async (req, res) => {
    try {
        const foodId = req.params.id;

        const food = await Food.findByPk(foodId, {
            include: [{
                model: Restaurant,
                as: 'restaurant',
            },
            {
                model: Category,
                as: 'category',
            }]
        });

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "No food found with this ID",
            });
        }

        res.status(200).json({
            success: true,
            food,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in get single food API",
            error,
        });
    }
};

const getFoodByResturantController = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        const food = await Food.findAll({ where: { restaurantId } });

        if (!food || food.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No food found for this restaurant",
            });
        }

        res.status(200).json({
            success: true,
            message: "Food items for restaurant",
            food,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in get food by restaurant API",
            error,
        });
    }
};

const updateFoodController = async (req, res) => {
    try {
        const foodId = req.params.id;

        const food = await Food.findByPk(foodId);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "No food found",
            });
        }

        const updatedFields = req.body;

        await food.update(updatedFields);

        res.status(200).json({
            success: true,
            message: "Food item was updated",
            food,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in update food API",
            error,
        });
    }
};

const deleteFoodController = async (req, res) => {
    try {
        const foodId = req.params.id;

        const food = await Food.findByPk(foodId);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "No food found with this ID",
            });
        }

        await food.destroy();

        res.status(200).json({
            success: true,
            message: "Food item deleted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in delete food API",
            error,
        });
    }
};

module.exports = {
    createFoodController,
    getAllFoodsController,
    getSingleFoodController,
    getFoodByResturantController,
    updateFoodController,
    deleteFoodController,
};
