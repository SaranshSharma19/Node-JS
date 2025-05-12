const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSize = sequelize.define('ProductSize', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'product_sizes',
    timestamps: false
});

module.exports = ProductSize;
