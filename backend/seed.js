const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Noise cancelling over-ear headphones',
    price: 2999,
    stock: 50,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight sports shoes for everyday running',
    price: 1499,
    stock: 30,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable everyday cotton tee',
    price: 499,
    stock: 100,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'
  },
  {
    name: 'Backpack',
    description: '20L waterproof travel backpack',
    price: 899,
    stock: 40,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300'
  },
  {
    name: 'Smartwatch',
    description: 'Fitness tracking smartwatch with heart rate monitor',
    price: 3999,
    stock: 20,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
  },
  {
    name: 'Sunglasses',
    description: 'UV400 protection polarized sunglasses',
    price: 799,
    stock: 60,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300'
  },
];

const seed = async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log('✅ Products seeded successfully!');
  process.exit();
};

seed();