const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/create-category', createCategory);
router.get('/get-category', getCategories);
router.get('/get-categorybyid/:id', getCategoryById);
router.put('/update-category/:id', adminMiddleware, updateCategory);
router.delete('/delete-category/:id', adminMiddleware, deleteCategory);


module.exports = router;
