module.exports = (sequelize, DataTypes, User, Contact ) => {
    const UserContacts = sequelize.define(
        'UserContacts',
        {
            UserId: {
                type: DataTypes.STRING,
                references: {
                    model: User,
                    key: 'id'
                } 
            },
            ContactId: {
                type: DataTypes.STRING,
                references: {
                    model: Contact,
                    key: 'id'
                }
            },
        },
        {
            // timestamps: false,
            createdAt: false,
            updatedAt: true,
        }
    );
    return UserContacts;
}