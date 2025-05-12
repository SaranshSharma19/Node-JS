const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');
const sequelize = require('./config/database');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 4003;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Inventory service is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();