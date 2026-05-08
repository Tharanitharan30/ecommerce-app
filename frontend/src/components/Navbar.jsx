import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">ShopApp</Link>
      <div className="flex gap-4 items-center">
        <Link to="/cart" className="text-gray-600 hover:text-indigo-600">Cart</Link>
        {user ? (
          <>
            <Link to="/orders" className="text-gray-600 hover:text-indigo-600">Orders</Link>
            <span className="text-gray-500 text-sm">{user.name}</span>
            <button onClick={handleLogout}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login"
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;