const Book = require('../models/book')

const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find({})
        if (allBooks.length > 0) {
            return res.status(200).json({
                success: true,
                message: "List of Books fetched Successfully",
                data: allBooks
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'No book found in collection'
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!!'
        })
    }
}

const getSingleBookByID = async (req, res) => {
    try {
        const getCurrentBookId = req.params.id;
        const bookDetailsById = await Book.findById(getCurrentBookId);
        if (!bookDetailsById) {
            return res.status(404).json({
                success: false,
                message: `No book found with this particuular Id ${getCurrentBookId}`
            })
        }

        res.status(200).json({
            success: true,
            message: bookDetailsById,
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!!'
        })
    }
}

const addNewBooks = async (req, res) => {
    try {
        const newBookFormData = req.body;
        const newlyCreatedBook = await Book.create(newBookFormData);
        if (newlyCreatedBook) {
            res.status(201).json({
                success: true,
                message: 'Book added successfully',
                data: newlyCreatedBook
            })
        }
    }
    catch (err) {
        console.error(`Unable to add book ${err}`)
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!!'
        })
    }

}

const updateBook = async (req, res) => {
    try {
        const getCurrentBookById = req.params.id;
        const getUpdateBookFormData = req.body;
        const updatedBook = await Book.findByIdAndUpdate(getCurrentBookById, getUpdateBookFormData, {
            new: true
        })
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: `No book found with this particular Id ${getCurrentBookById}`
            })
        }
        res.status(200).json({
            success: true,
            message: 'Updated Book',
            data: updatedBook,
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!!'
        })
    }

}

const deleteBook = async (req, res) => {
    try {
        const getCurrentBookById = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(getCurrentBookById)
        if (!deleteBook) {
            return res.status(404).json({
                success: false,
                message: `No book found with this particular Id ${getCurrentBookById}`
            })
        }
        res.status(200).json({
            success: true,
            message: deletedBook,
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later!!'
        })
    }

}

module.exports = { getAllBooks, getSingleBookByID, addNewBooks, updateBook, deleteBook }