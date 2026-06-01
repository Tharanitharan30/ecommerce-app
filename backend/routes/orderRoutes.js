const express = require('express');
const router  = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createPaymentOrder,
  verifyPayment,
  createPaymentForExistingOrder,
  verifyExistingOrderPayment,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/pay',           protect, createPaymentOrder);
router.post('/verify',        protect, verifyPayment);
router.post('/:id/pay',       protect, createPaymentForExistingOrder);
router.post('/:id/verify',    protect, verifyExistingOrderPayment);
router.post('/',              protect, placeOrder);
router.get('/myorders',       protect, getMyOrders);
router.get('/',               protect, adminOnly, getAllOrders);
router.put('/:id/status',     protect, adminOnly, updateOrderStatus);

module.exports = router;
