require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const cartRoutes = require('./routes/cartRoutes');
app.use(express.json());

app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 4002;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Cart Service is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();
