import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart"        element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders"      element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;