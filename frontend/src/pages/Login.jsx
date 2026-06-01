import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { bodyStyle, buttonStyle, fadeUp, inputStyle, pageStyle, sectionTitleStyle, theme } from '../theme';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          Welcome back
        </p>
        <h1 style={{ ...sectionTitleStyle, fontSize: '2rem', marginTop: 12 }}>Sign In</h1>
        <p style={{ ...bodyStyle, marginTop: 10 }}>Access your account to continue shopping.</p>

        <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              style={inputStyle(Boolean(error))}
            />
          </label>
          {error && <p style={{ margin: 0, color: theme.colors.danger, fontSize: 14 }}>{error}</p>}
          <button onClick={handleSubmit} style={buttonStyle()}>
            Sign In
          </button>
        </div>

        <p style={{ ...bodyStyle, marginTop: 22, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: theme.colors.primary, textDecoration: 'none', fontWeight: 700 }}>
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

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
