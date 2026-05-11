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
      style={cardStyle({ overflow: 'hidden' })}
    >
      <Link to={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          style={{
            position: 'relative',
            background: '#eef2f7',
            padding: 14,
          }}
        >
          <img
            src={product.image || 'https://via.placeholder.com/420'}
            alt={product.name}
            style={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              borderRadius: 18,
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              ...badgeStyle('gold'),
            }}
          >
            {product.category}
          </div>
          {lowStock && (
            <div
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                ...badgeStyle('danger'),
              }}
            >
              Low stock
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: 18, display: 'grid', gap: 14 }}>
        <div>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                margin: '0 0 8px',
                color: theme.colors.text,
                fontSize: 20,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h3>
          </Link>
          <p style={bodyStyle}>{product.description || 'Reliable essentials for everyday shopping.'}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, color: theme.colors.text, fontWeight: 800, fontSize: 22 }}>
              {formatCurrency(product.price)}
            </p>
            <p style={{ margin: '4px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>
              {product.stock} available
            </p>
          </div>
          <button onClick={handleAdd} style={buttonStyle(added ? 'secondary' : 'primary')}>
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
