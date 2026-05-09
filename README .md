# 🛒 ShopApp — Full Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with **React**, **Node.js (Express)**, and **MongoDB**. Features complete product browsing, cart management, secure authentication, and Razorpay payment integration.

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Product listing with search, category filters, and sort options |
| **Product Detail** | Full product view with quantity selector and stock status |
| **Cart** | Cart management with quantity controls and order placement |
| **Checkout** | Secure checkout with Razorpay payment integration |
| **Login / Register** | JWT-based authentication |
| **Order History** | Track all past orders with real-time status |

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI framework & build tool |
| React Router DOM | Client-side routing |
| Zustand | Global state (auth + cart) |
| Axios | HTTP client with JWT interceptor |
| Tailwind CSS | Utility-first styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| Razorpay | Payment gateway |
| Multer | Image/file upload handling |
| Nodemon | Dev auto-restart |

---

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe
│   │   ├── productController.js  # CRUD for products
│   │   ├── cartController.js     # Cart operations
│   │   └── orderController.js    # Orders + Razorpay
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── uploads/                  # Product images
│   ├── seed.js                   # Sample product seeder
│   ├── server.js                 # App entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── OrderHistory.jsx
    │   ├── services/
    │   │   └── api.js            # Axios instance + interceptor
    │   ├── store/
    │   │   ├── authStore.js      # Zustand auth state
    │   │   └── cartStore.js      # Zustand cart state
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── .env
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local via Compass or MongoDB Atlas)
- Razorpay account (for payments)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

Seed the database with sample products:

```bash
node seed.js
```

Start the backend server:

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create new account |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | Yes | Get current user |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all products (supports `?search=`, `?category=`, `?sort=`) |
| GET | `/:id` | No | Get product by ID |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Cart — `/api/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user's cart |
| POST | `/` | Yes | Add item to cart |
| PUT | `/:productId` | Yes | Update item quantity |
| DELETE | `/:productId` | Yes | Remove item |
| DELETE | `/` | Yes | Clear entire cart |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Place order (COD) |
| POST | `/pay` | Yes | Create Razorpay payment order |
| POST | `/verify` | Yes | Verify payment + save order |
| GET | `/myorders` | Yes | Get user's orders |
| GET | `/` | Admin | Get all orders |
| PUT | `/:id/status` | Admin | Update order status |

---

## 💳 Payment Testing (Razorpay Test Mode)

Use these test credentials when the Razorpay popup appears:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `1234` |
| UPI ID | `success@razorpay` |

---

## 🗃️ Database Models

### User
```
name, email, password (hashed), role (user/admin), createdAt
```

### Product
```
name, description, price, stock, category, image, createdAt
```

### Cart
```
user (ref), items: [{ product (ref), quantity }]
```

### Order
```
user (ref), items: [{ product, name, quantity, price }],
totalPrice, address, status, isPaid, paymentId, createdAt
```

---

## 🔐 Authentication Flow

1. User registers/logs in → receives JWT token
2. Token stored in `localStorage`
3. Axios interceptor auto-attaches token to every request header:
   ```
   Authorization: Bearer <token>
   ```
4. Backend `protect` middleware verifies token on protected routes
5. `adminOnly` middleware restricts admin-only routes

---

## 📦 Available Scripts

### Backend
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start in production mode
node seed.js    # Seed sample products to database
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy /dist folder to Vercel
```

### Backend → Railway or Render
1. Push backend to GitHub
2. Connect repo to Railway/Render
3. Add environment variables from `.env`
4. Set start command: `node server.js`

> Remember to update `VITE_API_URL` in your frontend `.env` to your deployed backend URL before building.

---

## 🛠️ Environment Variables Summary

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 👤 Author

**Tharanitharan S**
Full Stack Developer & ML Engineer — Coimbatore, India

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
