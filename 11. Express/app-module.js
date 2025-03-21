const express = require('express')

const app = express();

// Application Level Settings
app.set('view-engine', 'ejs')

// Routing
app.get('/',  (req,res) => {
    res.send('Home Page')
})

app.post('/api/data', (req,res) => {
    res.json({
        message: 'Data Received',
        data: req.body
    })
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('something went wrong')
})

const port = 3001
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})