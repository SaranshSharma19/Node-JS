const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    logging: false,
    dialect: 'postgres'
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/userModel.js')(sequelize, DataTypes);
db.otp = require('../models/otpModel.js')(sequelize, DataTypes);
db.resturant = require('../models/resturantModel.js')(sequelize, DataTypes);
db.category = require('../models/categoryModel.js')(sequelize, DataTypes);
db.food = require('../models/foodModel.js')(sequelize, DataTypes, db.category, db.resturant);
db.order = require('../models/orderModel.js')(sequelize, DataTypes, db.user, db.food);
db.OrderFoods = require('../models/OrderFoodsModel.js')(sequelize, DataTypes);

db.resturant.hasMany(db.food, {
    foreignKey: 'restaurantId',
    as: 'food'
});
db.food.belongsTo(db.resturant, {
    foreignKey: 'restaurantId',
    as: 'restaurant'
});

db.category.hasMany(db.food, {
    foreignKey: 'categoryId',
    as: 'food'
});
db.food.belongsTo(db.category, {
    foreignKey: 'categoryId',
    as: 'category'
});

db.user.hasMany(db.order, { foreignKey: 'buyerId', as: 'orders' });
db.order.belongsTo(db.user, { foreignKey: 'buyerId', as: 'buyer' });

db.order.belongsToMany(db.food, {
    through: db.OrderFoods,
    foreignKey: 'orderId',
    otherKey: 'foodId',
    as: 'foods'
});
db.food.belongsToMany(db.order, {
    through: db.OrderFoods,
    foreignKey: 'foodId',
    otherKey: 'orderId',
    as: 'orders'
});

db.sequelize.sync({ force: false })
module.exports = db;
