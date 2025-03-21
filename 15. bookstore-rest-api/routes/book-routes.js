const express = require('express');
const {getAllBooks, getSingleBookByID, addNewBooks, updateBook, deleteBook} = require('../controllers/book-controller')

// create express router
const router = express.Router()

// all the routes related to books only

router.get('/get', getAllBooks);
router.get('/get/:id', getSingleBookByID);
router.post('/add', addNewBooks);
router.put('/update/:id', updateBook);
router.delete('/delete/:id', deleteBook)

module.exports = router;