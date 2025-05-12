const express = require('express');
const cookieParser = require("cookie-parser");
const createBasicRateLimiter = require('./middleware/rateLimiting');
const urlVersioning = require('./middleware/apiVersioning');
require('./config/db.js');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlVersioning('v1'));
const rateLimit = createBasicRateLimiter(5, 5 * 60 * 100);

app.use("/api/v1/auth", rateLimit, require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/resturant", require("./routes/resturantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoute"));
app.use("/api/v1/order", require("./routes/orderRoute"));


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})