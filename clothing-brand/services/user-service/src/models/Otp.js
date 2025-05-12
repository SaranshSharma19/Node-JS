const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Otp = sequelize.define('Otp', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['createdAt']
        }
    ],
});

module.exports = Otp;