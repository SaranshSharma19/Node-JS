const express = require('express');
const router = express.Router();
const {
    createInventory,
    getInventory,
    updateInventory,
    updateStock,
    deleteInventory,
    decrementStock,
    incrementStock,
} = require('../controllers/inventory');

router.post('/create', createInventory);
router.get('/get/:productId', getInventory);
router.put('/update-inventory/:productId', updateInventory);
router.patch('/update-stock/:productId/stock', updateStock);
router.delete('/delete/:productId', deleteInventory);
router.put('/:productId/decrement', decrementStock);
router.put('/:productId/increment', incrementStock);

module.exports = router;