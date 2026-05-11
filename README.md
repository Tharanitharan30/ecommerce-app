# Ecommerce App

A full-stack ecommerce application with a React frontend and an Express + MongoDB backend. The app supports product browsing, authentication, cart management, order history, cash-on-delivery orders, and Razorpay-based payments.

## Features

- Product catalog with search, category filters, and sorting
- Product detail pages with stock visibility and quantity selection
- User registration and login with JWT authentication
- Protected cart, checkout, and order history routes
- Cart quantity updates and item removal
- Order placement with delivery address support
- Razorpay payment flow with backend verification

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Zustand
- Axios
- Custom CSS and shared theme tokens

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- Razorpay
- Multer

## Project Structure

```text
ecommerce-app/
|-- backend/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- cartController.js
|   |   |-- orderController.js
|   |   `-- productController.js
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- Cart.js
|   |   |-- Order.js
|   |   |-- Product.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- cartRoutes.js
|   |   |-- orderRoutes.js
|   |   `-- productRoutes.js
|   |-- seed.js
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- store/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- theme.js
|   `-- package.json
`-- README.md
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Product listing with filters and search |
| `/product/:id` | Product details and add-to-cart flow |
| `/login` | User sign-in |
| `/register` | User registration |
| `/cart` | Cart review and order placement |
| `/checkout` | Razorpay checkout flow |
| `/orders` | Order history |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB local instance or MongoDB Atlas
- Razorpay test account for payment testing

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=replace_with_a_secure_secret
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Important:

- Do not commit real secrets to source control.
- If this repository has previously contained live credentials, rotate them before deploying or sharing the project.

### 3. Seed the database

```bash
cd backend
node seed.js
```

### 4. Run the app

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Overview

### Auth - `/api/auth`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Create a new account |
| `POST` | `/login` | Public | Authenticate and return a token |
| `GET` | `/me` | Private | Get the current user |

### Products - `/api/products`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all products |
| `GET` | `/:id` | Public | Get one product |
| `POST` | `/` | Admin | Create a product |
| `PUT` | `/:id` | Admin | Update a product |
| `DELETE` | `/:id` | Admin | Delete a product |

### Cart - `/api/cart`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Private | Get the user's cart |
| `POST` | `/` | Private | Add an item to cart |
| `PUT` | `/:productId` | Private | Update cart quantity |
| `DELETE` | `/:productId` | Private | Remove one cart item |
| `DELETE` | `/` | Private | Clear the cart |

### Orders - `/api/orders`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/` | Private | Place a non-paid order |
| `POST` | `/pay` | Private | Create a Razorpay order |
| `POST` | `/verify` | Private | Verify payment and save order |
| `GET` | `/myorders` | Private | Get the logged-in user's orders |
| `GET` | `/` | Admin | Get all orders |
| `PUT` | `/:id/status` | Admin | Update order status |

## Payment Testing

For Razorpay test mode, you can use Razorpay's standard sandbox values, for example:

- Card number: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits
- OTP: `1234`
- UPI ID: `success@razorpay`

## Available Scripts

### Backend

```bash
npm run dev
npm start
node seed.js
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deployment Notes

- Deploy the frontend as a static Vite build.
- Deploy the backend to a Node-compatible host such as Render, Railway, or a VPS.
- Update `VITE_API_URL` to your deployed backend URL before building the frontend.
- Add all backend environment variables in your hosting provider dashboard.

## Future Improvements

- Admin dashboard for product and order management
- Better form validation and user-facing error states
- Product image upload UI
- Automated tests for frontend and backend flows
- Pagination and server-side filtering for large catalogs

## Author

Tharanitharan S
