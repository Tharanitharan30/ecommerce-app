import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { bodyStyle, buttonStyle, fadeUp, inputStyle, pageStyle, sectionTitleStyle, theme } from '../theme';

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
    <div style={{ ...pageStyle, minHeight: 'calc(100vh - 88px)', display: 'grid', placeItems: 'center' }}>
      <motion.div
        {...fadeUp}
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '48px clamp(24px, 4vw, 40px)',
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.lg,
        }}
      >
        <p style={{ margin: 0, color: theme.colors.primary, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
          Create account
        </p>
        <h1 style={{ ...sectionTitleStyle, fontSize: '2rem', marginTop: 12 }}>Register</h1>
        <p style={{ ...bodyStyle, marginTop: 10 }}>Set up your account to manage orders and checkout faster.</p>

        <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
          <label style={labelStyle}>
            Full Name
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              style={inputStyle(Boolean(error))}
            />
          </label>
          <label style={labelStyle}>
            Email Address
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              style={inputStyle(Boolean(error))}
            />
          </label>
          <label style={labelStyle}>
            Password
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              style={inputStyle(Boolean(error))}
            />
          </label>
          {error && <p style={{ margin: 0, color: theme.colors.danger, fontSize: 14 }}>{error}</p>}
          <button onClick={handleSubmit} style={buttonStyle()}>
            Create account
          </button>
        </div>

        <p style={{ ...bodyStyle, marginTop: 22, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: theme.colors.primary, textDecoration: 'none', fontWeight: 700 }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;

const labelStyle = {
  display: 'grid',
  gap: 6,
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 600,
};
