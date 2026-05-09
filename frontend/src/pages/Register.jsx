import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login }         = useAuthStore();
  const navigate          = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password)
      return setError('All fields are required');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          <button onClick={handleSubmit}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">
            Register
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;