const express = require('express');
const app = express();

app.use(express.json());

let books = [
    {
        id: '1',
        title: 'Book 1'
    },
    {
        id: '2',
        title: 'Book 2'
    },
]

// intro route
app.get('/', (req,res)=> {
    res.json({
        message: "Welcome to our bookstore api",
    })
})

app.get('/get', (req,res) => {
    res.json(books);
})

app.get('/get/:id', (req,res) => {
    const book = books.find(item => item.id === req.params.id)
    if(book){
        res.status(200).json(book)
    }
    else{
        res.status(404).json({
            message: 'Book not found. Please try with different book id!'
        })
    }
})

// add a new book
app.post('/add', (req, res) => {
    const newBook = {
        id: `${books.length + 1}`,
        title: `Book ${books.length + 1}`
    }

    books.push(newBook)
    res.status(200).json({
        data: newBook,
        message: 'New Book Added Successfully'
    })
})

// Update a book
app.put('/update/:id', (req, res) => {
    const findCurrentBook = books.find(bookItem => bookItem.id === req.params.id)
    if(findCurrentBook){
        findCurrentBook.title = req.body.title || findCurrentBook.title
        res.status(200).json({
            message: `Book with ID ${req.params.id} updated successfully`,
            data: findCurrentBook
        })
    }else{
        res.status(404).json({
            message: 'Book Not Found',
        })
    }
})

// delete a book
app.delete('/delete/:id', (req,res) => {
    const filteredBooks = books.filter(book => book.id !== req.params.id);
    const findIndexOfCurrentBook = books.findIndex(item => item.id === req.params.id)
    if(findIndexOfCurrentBook !== -1){
        const deletedBook = books.splice(findIndexOfCurrentBook,1)
        console.log("deletedBook[0]",deletedBook[0])
        res.status(200).json({
            message: 'Book Deleted Successfully',
            data: deletedBook[0]
        })
    }else{
        res.status(404).json({
            message: 'Book Not Found',
        })
    }
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})