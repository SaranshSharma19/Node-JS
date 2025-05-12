const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactDetail = sequelize.define('ContactDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    phone: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            validatePhoneNumbers(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Phone numbers must be an array');
                }

                const phoneRegex = /^[0-9]{10}$/;
                for (const phone of value) {
                    if (!phoneRegex.test(phone)) {
                        throw new Error('Each phone number must be exactly 10 digits');
                    }
                }
            }
        }
    },
}, {
    tableName: 'contact_details'
});

module.exports = ContactDetail;
