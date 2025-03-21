require('dotenv').config()
const express = require('express');
const {configureCors} = require('./config/corsConfig');
const { requestLogger, addTimeStamp } = require('./middleware/customMiddleware');
const { globalErrorHandler } = require('./middleware/errorHandler');
const { urlVersioning } = require('./middleware/apiVersioning');
const { createBasicRateLimiter } = require('./middleware/rateLimiting');
const itemRoutes = require('./routes/item-routes');

const app = express();
const PORT = process.env.PORT || 3001

// express json middleware
app.use(express.json());
app.use(configureCors());
app.use(createBasicRateLimiter(5 , 15*60*100)) // 100 request per 15 minutes
app.use(requestLogger)
app.use(addTimeStamp)
app.use(urlVersioning('v1'))
app.use('/api/v1', itemRoutes)
app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}`);
})