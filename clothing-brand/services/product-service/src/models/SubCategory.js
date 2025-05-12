const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const SubCategory = sequelize.define('SubCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'subcategories'
});

SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(SubCategory, { foreignKey: 'categoryId' });

module.exports = SubCategory;
