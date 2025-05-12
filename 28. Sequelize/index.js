const express = require('express');
const bodyParser = require('body-parser');
require('./models/index.js');
const app = express()
app.use(bodyParser.json())
var userCtrl = require('./controllers/userController.js');

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/add', userCtrl.addUser);
app.get('/getUser', userCtrl.getUser);
app.get('/getUser/:id', userCtrl.getUserById);
app.delete('/deleteUser/:id', userCtrl.deleteUser);
app.patch('/updateUser/:id', userCtrl.updateUser);

app.get('/query', userCtrl.queryUser);
app.get('/getset', userCtrl.getsetUser);
app.get('/raw', userCtrl.rawQueries);

app.get('/onetoone', userCtrl.oneTOOne);
app.get('/onetomany', userCtrl.oneTOMany);
app.get('/manytomany', userCtrl.manyTOMany);



app.listen(3002, () => {
    console.log(`Server is running on PORT 3002`)
})