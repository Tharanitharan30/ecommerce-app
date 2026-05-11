import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { bodyStyle, buttonStyle, cardStyle, fadeUp, inputStyle, pageStyle, sectionTitleStyle, theme } from '../theme';

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
    <div style={{ ...pageStyle, minHeight: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center' }}>
      <motion.div
        {...fadeUp}
        style={{
          ...cardStyle({
            width: '100%',
            maxWidth: 460,
            padding: '36px 30px',
          }),
        }}
      >
        <p style={{ margin: 0, color: theme.colors.primary, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700 }}>
          Welcome back
        </p>
        <h1 style={{ ...sectionTitleStyle, fontSize: '2.8rem', marginTop: 10 }}>Sign in</h1>
        <p style={{ ...bodyStyle, marginTop: 10 }}>Access your account to continue shopping.</p>

        <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
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
          <button onClick={handleSubmit} style={buttonStyle()}>
            Login
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
