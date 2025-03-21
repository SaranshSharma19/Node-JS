require('dotenv').config()

const express = require('express');
const app = express()
const connectToDB = require('./database/db')
const bookRoutes = require('./routes/book-routes')

const PORT = process.env.PORT || 3002

// connect to our database
connectToDB();

// middleware -> express.json()
app.use(express.json())

// Routes
app.use('/api/books', bookRoutes)

app.listen(PORT, () => {
    console.log(`Seerver is running on PORT ${PORT}`);
})

