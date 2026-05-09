import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600">ShopApp</Link>
      <div className="flex gap-4 items-center">
        <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-indigo-600 text-white
              text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <Link to="/orders" className="text-gray-600 hover:text-indigo-600">Orders</Link>
            <span className="text-gray-500 text-sm font-medium">{user.name}</span>
            <button onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-50 text-sm">
              Login
            </Link>
            <Link to="/register"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 text-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;