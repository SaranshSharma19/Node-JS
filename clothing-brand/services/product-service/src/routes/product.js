const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/create-product', createProduct);
router.get('/getall-products', getAllProducts);
router.get('/product/:id', getProductById);
router.put('/update-product/:id', adminMiddleware, updateProduct);
router.delete('/delete-product/:id', adminMiddleware, deleteProduct);

module.exports = router;
