const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  requestSellerAccess,
  getSellerRequests,
  updateSellerRequest,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);
router.put('/me',        protect, updateMe);
router.post('/request-seller', protect, requestSellerAccess);
router.get('/seller-requests', protect, adminOnly, getSellerRequests);
router.put('/seller-requests/:id', protect, adminOnly, updateSellerRequest);

module.exports = router;
