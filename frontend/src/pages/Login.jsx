import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <div className="flex flex-col gap-4">
        <input type="email" placeholder="Email"
          className="border rounded px-3 py-2"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password"
          className="border rounded px-3 py-2"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit}
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>
        <p className="text-center text-sm text-gray-500">
          No account? <Link to="/register" className="text-indigo-600">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;