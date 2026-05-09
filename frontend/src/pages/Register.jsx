import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { bodyStyle, buttonStyle, cardStyle, fadeUp, inputStyle, pageStyle, sectionTitleStyle, theme } from '../theme';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ ...pageStyle, minHeight: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center' }}>
      <motion.div
        {...fadeUp}
        style={{
          ...cardStyle({
            width: '100%',
            maxWidth: 480,
            padding: '40px 32px',
          }),
        }}
      >
        <p style={{ margin: 0, color: theme.colors.gold, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.22em' }}>Create Account</p>
        <h1 style={{ ...sectionTitleStyle, fontSize: '3.3rem', marginTop: 10 }}>Register</h1>
        <p style={{ ...bodyStyle, marginTop: 10 }}>Join a premium storefront built for modern shopping.</p>

        <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            style={inputStyle(Boolean(error))}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            style={inputStyle(Boolean(error))}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            style={inputStyle(Boolean(error))}
          />
          {error && <p style={{ margin: 0, color: theme.colors.danger, fontSize: 14 }}>{error}</p>}
          <button onClick={handleSubmit} style={buttonStyle()}>Create Account</button>
        </div>

        <p style={{ ...bodyStyle, marginTop: 22, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: theme.colors.gold, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
