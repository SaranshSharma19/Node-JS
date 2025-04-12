const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require('./config/db');
const urlVersioning = require('./middleware/apiVersioning');
const createBasicRateLimiter = require('./middleware/rateLimiting');
const cookieParser = require("cookie-parser");

dotenv.config();

connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(urlVersioning('v1'));
const rateLimit = createBasicRateLimiter(2, 5 * 60 * 100);


app.use("/api/v1/auth", rateLimit, require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/resturant", require("./routes/resturantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoutes"));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Serever is running on PORT ${PORT}`)
})