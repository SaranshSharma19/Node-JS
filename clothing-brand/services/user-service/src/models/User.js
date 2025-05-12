const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Address = require('./Address');
const ContactDetail = require('./Contact');
const Token = require('./Token');
const RefreshToken = require('./RefreshToken');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    authType: {
        type: DataTypes.ENUM('local', 'google'),
        allowNull: false,
        defaultValue: 'local'
    },
    userType: {
        type: DataTypes.ENUM('admin', 'user', 'supplier'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    hooks: {
        beforeValidate: (user) => {
            if (user.authType === 'local' && !user.password) {
                throw new Error('Password is required for local authentication');
            }
        }
    }
});

User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ContactDetail, { foreignKey: 'userId' });
ContactDetail.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
