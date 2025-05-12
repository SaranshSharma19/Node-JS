const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ORM', 'postgres', 'postgres', {
    host: 'localhost',
    logging: false,
    dialect: 'postgres'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.js')(sequelize, DataTypes);
db.contact = require('./contact.js')(sequelize, DataTypes);
db.usercontacts = require('./UserContacts.js')(sequelize, DataTypes, db.user, db.contact);

// db.user.hasOne(db.contact, {foreignKey: 'user_id', as: 'contact'});
db.user.hasMany(db.contact, {foreignKey: 'user_id', as: 'contact'});
db.contact.belongsTo(db.user, {foreignKey: 'user_id', as: 'user'});

db.user.belongsToMany(db.contact, { through: db.usercontacts });
db.contact.belongsToMany(db.user, { through: db.usercontacts });

db.sequelize.sync({force: false})
module.exports = db;