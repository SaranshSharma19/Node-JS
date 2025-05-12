const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const ProductImage = require('./ProductImage');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'products'
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });
SubCategory.hasMany(Product, { foreignKey: 'subCategoryId' });

Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Product;
