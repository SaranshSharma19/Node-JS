module.exports = (sequelize, DataTypes) => {
    const OrderFood = sequelize.define("OrderFood", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foodId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: "OrderFoods",
    });

    return OrderFood;
};