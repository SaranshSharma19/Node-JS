const express = require('express');
const router = express.Router();
const { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory, getSubCategoriesByCategoryId } = require('../controllers/subcategory');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/create-subcategory', createSubCategory);
router.get('/get-subcategories', getSubCategories);
router.get('/subcategory/:id', getSubCategoryById);
router.get('/get-subcategory-bycategoryid/:categoryId', getSubCategoriesByCategoryId);
router.put('/update-subcategory/:id', adminMiddleware, updateSubCategory);
router.delete('/delete-subcategory/:id', adminMiddleware, deleteSubCategory);

module.exports = router;
