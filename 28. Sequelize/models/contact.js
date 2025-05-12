module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        'Contact',
        {
            permanent_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            current_address: {
                type: DataTypes.STRING,
            },
            // user_id: DataTypes.INTEGER,
        },
        {
            // timestamps: false,
            createdAt: false,
            updatedAt: true,
        }
    );

    return Contact;
};