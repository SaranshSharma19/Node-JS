const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/User');
const cookieParser = require("cookie-parser");

dotenv.config();
require('./config/passport');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/UserRoute.js'));

app.get('/', (req, res) => res.status(200).json({
    success: true,
    message: 'Welcome to the User Service'
}));

const PORT = process.env.PORT || 4000;
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`User Service is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();
