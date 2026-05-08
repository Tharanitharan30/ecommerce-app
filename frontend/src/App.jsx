import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders"    element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;