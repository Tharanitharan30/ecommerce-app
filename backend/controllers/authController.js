const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address,
  sellerRequestStatus: user.sellerRequestStatus,
});

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({
      token: generateToken(user),
      user: serializeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user),
      user: serializeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const { name, address } = req.body;

    const updates = {};
    if (typeof name === 'string') updates.name = name.trim();
    if (typeof address === 'string') updates.address = address.trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/request-seller
exports.requestSellerAccess = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'seller' || user.role === 'admin')
      return res.status(400).json({ message: 'This account already has seller access' });
    if (user.sellerRequestStatus === 'pending')
      return res.status(400).json({ message: 'Seller request is already pending' });

    user.sellerRequestStatus = 'pending';
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/seller-requests
exports.getSellerRequests = async (req, res) => {
  try {
    const users = await User.find({ sellerRequestStatus: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/seller-requests/:id
exports.updateSellerRequest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action))
      return res.status(400).json({ message: 'Invalid seller request action' });

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'approve') {
      user.role = 'seller';
      user.sellerRequestStatus = 'approved';
    } else {
      if (user.role === 'seller') user.role = 'user';
      user.sellerRequestStatus = 'rejected';
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
