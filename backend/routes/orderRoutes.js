const express = require('express');
const router  = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createPaymentOrder,
  verifyPayment
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/pay',           protect, createPaymentOrder);
router.post('/verify',        protect, verifyPayment);
router.post('/',              protect, placeOrder);
router.get('/myorders',       protect, getMyOrders);
router.get('/',               protect, adminOnly, getAllOrders);
router.put('/:id/status',     protect, adminOnly, updateOrderStatus);

module.exports = router;