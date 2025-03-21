const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Hello Express JS")
    res.end("Home Page");
});

const port = 3001
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})