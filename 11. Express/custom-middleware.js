const express = require('express')

const app = express();

const requestTimeStampLogger = (req, res, next) => {
    const timeStamp = new Date().toTimeString();
    console.log(`${timeStamp} from ${req.method} to ${req.url}`)
    next()
}

app.use(requestTimeStampLogger)

app.get('/', (req, res) => {
    console.log('First request through middleware')
    res.send('Home Page')
})

app.get('/about', (req, res) => {
    console.log('Second request through middleware')
    res.send('About Page')
})

const port = 3001
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})