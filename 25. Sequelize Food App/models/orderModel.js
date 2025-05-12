module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        payment: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("preparing", "Pick up", "on the way", "delivered"),
            defaultValue: "preparing",
        },
    }, {
        timestamps: true,
    });

    return Order;
}
