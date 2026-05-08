const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  { name: 'Wireless Headphones', description: 'Noise cancelling over-ear headphones', price: 2999, stock: 50, category: 'Electronics', image: '' },
  { name: 'Running Shoes',       description: 'Lightweight sports shoes',             price: 1499, stock: 30, category: 'Footwear',    image: '' },
  { name: 'Cotton T-Shirt',      description: 'Comfortable everyday cotton tee',      price:  499, stock: 100, category: 'Clothing',   image: '' },
  { name: 'Backpack',            description: '20L waterproof travel backpack',        price:  899, stock: 40, category: 'Bags',        image: '' },
];

const seed = async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log('Products seeded!');
  process.exit();
};

seed();