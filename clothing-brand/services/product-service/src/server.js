const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const sequelize = require('./config/database.js');

app.use(express.json());

const productRoutes = require('./routes/product.js');
const categoryRoutes = require('./routes/category.js');
const subCategoryRoutes = require('./routes/subcategory.js');
const productImageRoutes = require('./routes/productImage.js');

app.get('/', (req, res) => {
    res.send('Welcome to the Product Service API!');
});


app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/product-images', productImageRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Product Service is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();