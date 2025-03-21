const express = require('express')

const app = express();

// define middleware function
const myFirstMiddleware = (req,res,next) => {
    console.log('this first middleware will run on every request'); 
    next()
}

app.use(myFirstMiddleware)

app.get('/', (req,res) => {
    console.log('First request through middleware')
    res.send('Home Page')
})

app.get('/about', (req,res) => {
    console.log('Second request through middleware')
    res.send('About Page')
})

const port = 3001
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})