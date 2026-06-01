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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const links = [
    { to: '/', label: 'New Arrivals' },
    ...(user ? [{ to: '/orders', label: 'Orders' }, { to: '/profile', label: 'Profile' }] : []),
    ...(['seller', 'admin'].includes(user?.role) ? [{ to: '/seller', label: 'Seller' }] : []),
  ];

  return (
    <motion.header
      {...fadeUp}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(249, 249, 249, 0.92)' : 'rgba(249, 249, 249, 0.72)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <nav
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '18px 16px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            letterSpacing: '-0.04em',
            fontWeight: 600,
            color: theme.colors.primary,
            lineHeight: 1,
          }}
        >
          LUXE
        </Link>

        <div
          className="nav-links"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
            minHeight: 24,
          }}
        >
          {links.map((link) => (
            <Link key={link.to} to={link.to} style={navLinkStyle(location.pathname === link.to)}>
              {link.label}
            </Link>
          ))}
        </div>

        <div
          className="nav-actions"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setMenuOpen((value) => !value)}
            style={{
              display: 'none',
              width: 42,
              height: 42,
              borderRadius: 8,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.primary,
            }}
            className="nav-mobile-toggle"
            aria-label="Toggle navigation"
          >
            {menuOpen ? 'X' : '|||'}
          </button>
          <Link
            to="/cart"
            style={{
              ...buttonStyle('ghost', {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                padding: '12px 16px',
                color: theme.colors.primary,
              }),
            }}
          >
            <CartIcon />
            Bag
            {cartCount > 0 && <span style={badgeStyle('gold')}>{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  textDecoration: 'none',
                  color: theme.colors.textMuted,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {user.name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={buttonStyle('secondary')}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...buttonStyle('secondary'), textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ ...buttonStyle(), textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      {menuOpen && (
        <div
          className="nav-mobile-panel"
          style={cardStyle({
            margin: '0 16px 16px',
            padding: 16,
          })}
        >
          <div style={{ display: 'grid', gap: 14 }}>
            {links.map((link) => (
              <Link key={link.to} to={link.to} style={navLinkStyle(location.pathname === link.to)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}

export default Navbar;
