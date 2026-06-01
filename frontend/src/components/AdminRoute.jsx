import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminRoute({ children }) {
  const { user, token } = useAuthStore();

  if (!token)                return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;

  return children;
}