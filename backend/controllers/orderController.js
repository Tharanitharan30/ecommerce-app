const Order    = require('../models/Order');
const Cart     = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto   = require('crypto');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { address } = req.body;
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price stock');

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const orderItems = cart.items.map(item => ({
      product:  item.product._id,
      name:     item.product.name,
      quantity: item.quantity,
      price:    item.product.price,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = await Order.create({
      user: req.user.id, items: orderItems, totalPrice, address
    });

    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/pay
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount:   amount * 100,
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      key:      process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      totalPrice,
      address,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed' });

    const order = await Order.create({
      user:      req.user.id,
      items:     cartItems,
      totalPrice,
      address,
      isPaid:    true,
      paymentId: razorpay_payment_id,
      status:    'pending',
    });

    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(201).json({ message: 'Payment successful', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};