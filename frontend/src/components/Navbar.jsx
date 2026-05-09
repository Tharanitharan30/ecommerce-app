import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { badgeStyle, buttonStyle, cardStyle, fadeUp, navLinkStyle, theme } from '../theme';

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M3 5h2l2.2 9.2a1.8 1.8 0 0 0 1.8 1.4h7.8a1.8 1.8 0 0 0 1.8-1.4L21 8H8.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.3" fill="currentColor" />
      <circle cx="18" cy="19" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/orders', label: 'Orders' },
    { to: '/cart', label: 'Cart' },
  ];

  return (
    <motion.header
      {...fadeUp}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 16px 0',
      }}
    >
      <nav
        style={{
          ...cardStyle({
            maxWidth: 1240,
            margin: '0 auto',
            padding: '14px 20px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 20,
            backdropFilter: 'blur(22px)',
            background: scrolled ? 'rgba(18, 18, 18, 0.94)' : 'rgba(18, 18, 18, 0.86)',
            boxShadow: scrolled ? theme.shadow.glow : theme.shadow.soft,
          }),
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(201,169,110,0.95), rgba(151,120,68,0.88))',
              color: '#17120d',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            A
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 0.9 }}>Aureline</p>
            <p style={{ margin: '2px 0 0', color: theme.colors.textMuted, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              Luxury Commerce
            </p>
          </div>
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 26,
            flexWrap: 'wrap',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={navLinkStyle(location.pathname === link.to)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/cart"
            style={{
              ...buttonStyle('ghost', {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                position: 'relative',
              }),
            }}
          >
            <CartIcon />
            Cart
            {cartCount > 0 && <span style={badgeStyle('gold')}>{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <span
                style={{
                  color: theme.colors.textMuted,
                  fontSize: 13,
                }}
              >
                {user.name}
              </span>
              <button onClick={() => { logout(); navigate('/login'); }} style={buttonStyle('secondary')}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...buttonStyle('secondary'), textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" style={{ ...buttonStyle(), textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
