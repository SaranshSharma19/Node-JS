module.exports = (sequelize, DataTypes) => {
    const Resturant = sequelize.define("Resturant", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "Resturant title is required" },
                notEmpty: { msg: "Resturant title cannot be empty" },
            },
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
        foods: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        time: {
            type: DataTypes.STRING,
        },
        pickup: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        delivery: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        logoUrl: {
            type: DataTypes.STRING,
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 1,
            validate: {
                min: 1,
                max: 5,
            },
        },
        ratingCount: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
        coords: {
            type: DataTypes.JSON,
        },
    }, {
        timestamps: true,
    });
    return Resturant;
}
