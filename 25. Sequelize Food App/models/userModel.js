module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "User name is required" },
                    notEmpty: { msg: "User name cannot be empty" },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: "Email is required" },
                    isEmail: { msg: "Must be a valid email address" },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Password is required" },
                    notEmpty: { msg: "Password cannot be empty" },
                },
            },
            address: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Phone number is required" },
                    notEmpty: { msg: "Phone number cannot be empty" },
                },
            },
            usertype: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "client",
                validate: {
                    notNull: { msg: "User type is required" },
                    isIn: {
                        args: [["client", "admin", "vendor", "driver"]],
                        msg: "User type must be one of client, admin, vendor, or driver",
                    },
                },
            },
            profile: {
                type: DataTypes.STRING,
                defaultValue:
                    "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
            },
        },
        {
            timestamps: true,
            tableName: "users",
        }
    );
    return User;
};