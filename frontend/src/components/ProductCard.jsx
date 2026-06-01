import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import {
  badgeStyle,
  bodyStyle,
  buttonStyle,
  cardStyle,
  fadeUp,
  formatCurrency,
  skeletonStyle,
  theme,
} from '../theme';

export default function ProductCard({ product, loading = false, index = 0 }) {
  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    await addToCart(product._id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <div style={cardStyle({ padding: 18 })}>
        <div style={skeletonStyle(220)} />
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <div style={skeletonStyle(14, { width: '35%' })} />
          <div style={skeletonStyle(24, { width: '70%' })} />
          <div style={skeletonStyle(18, { width: '48%' })} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div style={skeletonStyle(28, { width: 92 })} />
            <div style={skeletonStyle(42, { width: 132, borderRadius: 14 })} />
          </div>
        </div>
      </div>
    );
  }

  const lowStock = Number(product.stock) > 0 && Number(product.stock) <= 5;

  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      style={cardStyle({ overflow: 'hidden', background: 'transparent', border: 'none' })}
    >
      <Link to={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '4 / 5',
            background: theme.colors.surfaceAlt,
            overflow: 'hidden',
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            marginBottom: 20,
          }}
        >
          <img
            src={product.image || 'https://via.placeholder.com/420'}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 700ms ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              ...badgeStyle('gold'),
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {lowStock ? 'Low stock' : 'New'}
          </div>
        </div>
      </Link>

      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <p style={{ ...eyebrowFallbackStyle, marginBottom: 6 }}>{product.category}</p>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                margin: '0 0 8px',
                color: theme.colors.text,
                fontSize: 20,
                lineHeight: 1.2,
                fontWeight: 600,
              }}
            >
              {product.name}
            </h3>
          </Link>
          <p style={{ ...bodyStyle, fontSize: 15 }}>
            {product.description || 'Reliable essentials for everyday shopping.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, color: theme.colors.text, fontWeight: 800, fontSize: 22 }}>
              {formatCurrency(product.price)}
            </p>
            <p style={{ margin: '4px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>
              {product.stock} available
            </p>
          </div>
          <button onClick={handleAdd} style={buttonStyle(added ? 'secondary' : 'primary', { padding: '12px 16px' })}>
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

const eyebrowFallbackStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 12,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontWeight: 600,
};
