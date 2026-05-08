const Order = require('../models/Order');
const Cart  = require('../models/Cart');

// POST /api/orders — place order
exports.placeOrder = async (req, res) => {
  try {
    const { address } = req.body;
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price stock');

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Check stock for every item
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`
        });
    }

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
      user: req.user.id,
      items: orderItems,
      totalPrice,
      address,
    });

    // Clear cart after order
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

// GET /api/orders  (admin)
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

// PUT /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};