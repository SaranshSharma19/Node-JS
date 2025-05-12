module.exports = (sequelize, DataTypes, category, resturant) => {
    const Food = sequelize.define(
        "Food",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Food Title is required" },
                    notEmpty: { msg: "Food Title cannot be empty" },
                },
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Food description is required" },
                    notEmpty: { msg: "Food description cannot be empty" },
                },
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    notNull: { msg: "Food price is required" },
                    isFloat: { msg: "Food price must be a number" },
                },
            },
            imageUrl: {
                type: DataTypes.STRING,
                defaultValue:
                    "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png",
            },
            foodTags: {
                type: DataTypes.STRING,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: category,
                    key: "id",
                },
            },
            code: {
                type: DataTypes.STRING,
            },
            isAvailable: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            restaurantId: {
                type: DataTypes.INTEGER,
                references: {
                    model: resturant,
                    key: "id",
                },  
            },
            rating: {
                type: DataTypes.FLOAT,
                defaultValue: 5,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            ratingCount: {
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: true,
            tableName: "Foods",
        }
    );
    return Food;
}