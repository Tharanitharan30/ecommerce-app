const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: node makeAdmin.js user@example.com');
    process.exit(1);
  }

  const user = await User.findOneAndUpdate(
    { email },
    { role: 'admin', sellerRequestStatus: 'approved' },
    { new: true }
  );

  if (user) console.log(`${user.email} is now an admin`);
  else console.log('User not found. Check your email.');

  process.exit();
};

makeAdmin();
