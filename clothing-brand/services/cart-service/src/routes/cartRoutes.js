const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
} = require('../controllers/cartItemController');

router.use(authMiddleware);

router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.put('/update/:productId', updateCartItem);
router.get('/get', getCart);
router.delete('/clear', clearCart);

module.exports = router;