module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('firstName');
                    return rawValue.toUpperCase();
                }
            },
            lastName: {
                type: DataTypes.STRING,
                defaultValue: 'Sharma',
                set(value) {
                    this.setDataValue('lastName', value + ' Indian');
                }
            },
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                },
                set(value) {
                    throw new Error('Do not try to set the `fullName` value!');
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            // timestamps: false,
            createdAt: false,
            updatedAt: true,
        }
    );
    return User;
}