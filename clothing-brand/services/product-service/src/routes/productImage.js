const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
    uploadProductImage,
    deleteProductImage,
    getImagesByProductId,
    getImageById,
    updateProductImage
} = require('../controllers/productImage');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

router.post('/upload', upload.single('image'), uploadProductImage);
router.get('/images/:productId', getImagesByProductId);
router.get('/image/:id', getImageById);
router.put('/update-image/:id', adminMiddleware, upload.single('image'), updateProductImage);
router.delete('/delete-image/:id', adminMiddleware, deleteProductImage);

module.exports = router;
    