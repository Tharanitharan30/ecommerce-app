import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function SellerRoute({ children }) {
  const { user, token } = useAuthStore();

  if (!token) return <Navigate to="/login" />;
  if (!['seller', 'admin'].includes(user?.role)) return <Navigate to="/profile" />;

  return children;
}
