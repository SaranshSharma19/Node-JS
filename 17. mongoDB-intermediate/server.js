require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
connectToDB();

const productRoutes = require('./routes/product-routes')
const bookRoutes = require('./routes/book-routes')

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use('/products', productRoutes)
app.use('/reference', bookRoutes)

app.listen(PORT, () => {
  console.log(`Server is now listeining to PORT ${PORT}`);
});