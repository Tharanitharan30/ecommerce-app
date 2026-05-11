import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import {
  badgeStyle,
  bodyStyle,
  buttonStyle,
  cardStyle,
  emptyStateStyle,
  fadeUp,
  formatCurrency,
  pageStyle,
  quantityButtonStyle,
  sectionTitleStyle,
  skeletonStyle,
  softCardStyle,
  theme,
} from '../theme';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { token } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let canceled = false;

    api.get(`/products/${id}`)
      .then((response) => {
        if (canceled) return;
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [id]);

  const handleAdd = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    await addToCart(product._id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle({ padding: 24, display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' })}>
          <div style={skeletonStyle(460)} />
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={skeletonStyle(18, { width: 180 })} />
            <div style={skeletonStyle(52, { width: '75%' })} />
            <div style={skeletonStyle(16, { width: '92%' })} />
            <div style={skeletonStyle(16, { width: '88%' })} />
            <div style={skeletonStyle(44, { width: 210, borderRadius: 14, marginTop: 12 })} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 42, color: theme.colors.textMuted }}>404</div>
          <h2 style={{ margin: 0, fontSize: 32, color: theme.colors.text }}>Product not found</h2>
          <p style={{ ...bodyStyle, maxWidth: 420 }}>The item you requested is unavailable or has been removed.</p>
          <button onClick={() => navigate('/')} style={buttonStyle()}>Back to home</button>
        </div>
      </div>
    );
  }

  const stockTone = product.stock > 0 ? 'success' : 'danger';

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ marginBottom: 18, display: 'flex', gap: 10, flexWrap: 'wrap', color: theme.colors.textMuted, fontSize: 13 }}>
        <Link to="/" style={{ color: theme.colors.textMuted, textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: theme.colors.text }}>{product.name}</span>
      </div>

      <section style={cardStyle({ padding: 24, display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' })}>
        <div style={{ background: '#eef2f7', borderRadius: 24, padding: 16 }}>
          <img
            src={product.image || 'https://via.placeholder.com/540'}
            alt={product.name}
            style={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 18, display: 'block' }}
          />
        </div>

        <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
          <div style={badgeStyle('gold')}>{product.category}</div>
          <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(2.8rem, 6vw, 4.2rem)' }}>{product.name}</h1>
          <p style={{ ...bodyStyle, fontSize: 16 }}>{product.description || 'A practical product page with a clear summary, pricing, and purchase flow.'}</p>
          <p style={{ margin: 0, color: theme.colors.text, fontWeight: 800, fontSize: 30 }}>{formatCurrency(product.price)}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: stockTone === 'success' ? theme.colors.success : theme.colors.danger,
                display: 'inline-block',
              }}
            />
            <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ ...softCardStyle({ padding: 8, display: 'inline-flex', alignItems: 'center', gap: 10 }) }}>
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} style={quantityButtonStyle}>-</button>
              <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => setQuantity((value) => Math.min(product.stock || value + 1, value + 1))} style={quantityButtonStyle}>+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              style={buttonStyle(
                added ? 'secondary' : 'primary',
                product.stock === 0
                  ? { opacity: 0.45, cursor: 'not-allowed' }
                  : {}
              )}
            >
              {added ? 'Added' : 'Add to cart'}
            </button>
            <button onClick={() => navigate('/')} style={buttonStyle('ghost')}>Back</button>
          </div>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', marginTop: 8 }}>
            {['Secure payment', 'Fast shipping', 'Easy returns'].map((item) => (
              <div key={item} style={{ ...softCardStyle({ padding: 16 }) }}>
                <p style={{ margin: 0, color: theme.colors.text, fontWeight: 700 }}>{item}</p>
                <p style={{ margin: '6px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>
                  Simple and reliable support for every purchase
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default ProductDetail;
