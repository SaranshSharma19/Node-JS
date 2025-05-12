const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
app.use('/api/order', require('./routes/orderRoutes'))

const PORT = process.env.PORT || 4004;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Order service is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();