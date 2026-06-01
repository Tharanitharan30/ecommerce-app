const express = require('express');
const router  = express.Router();
const {
  getAllProducts, getProductById, getMyProducts,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, sellerOrAdminOnly } = require('../middleware/authMiddleware');

router.get('/',       getAllProducts);
router.get('/mine',   protect, sellerOrAdminOnly, getMyProducts);
router.get('/:id',    getProductById);
router.post('/',      protect, sellerOrAdminOnly, createProduct);
router.put('/:id',    protect, sellerOrAdminOnly, updateProduct);
router.delete('/:id', protect, sellerOrAdminOnly, deleteProduct);

module.exports = router;
