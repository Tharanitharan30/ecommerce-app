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
        <div style={skeletonStyle(240)} />
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <div style={skeletonStyle(14, { width: '35%' })} />
          <div style={skeletonStyle(26, { width: '70%' })} />
          <div style={skeletonStyle(18, { width: '48%' })} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div style={skeletonStyle(28, { width: 92 })} />
            <div style={skeletonStyle(46, { width: 148, borderRadius: 999 })} />
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
      whileHover={{ y: -6 }}
      style={cardStyle({ overflow: 'hidden' })}
    >
      <Link to={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          style={{
            position: 'relative',
            background: '#141414',
            padding: 16,
          }}
        >
          <img
            src={product.image || 'https://via.placeholder.com/420'}
            alt={product.name}
            style={{
              width: '100%',
              height: 250,
              objectFit: 'cover',
              borderRadius: 22,
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 28,
              ...badgeStyle('gold'),
            }}
          >
            {product.category}
          </div>
          {lowStock && (
            <div
              style={{
                position: 'absolute',
                top: 28,
                right: 28,
                ...badgeStyle('danger'),
              }}
            >
              Low Stock
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: '0 20px 20px', display: 'grid', gap: 14 }}>
        <div>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                margin: '2px 0 10px',
                color: theme.colors.text,
                fontFamily: 'var(--font-heading)',
                fontSize: 32,
                lineHeight: 0.96,
              }}
            >
              {product.name}
            </h3>
          </Link>
          <p style={bodyStyle}>{product.description || 'Refined essentials for modern premium shopping.'}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, color: theme.colors.gold, fontWeight: 600, fontSize: 24 }}>{formatCurrency(product.price)}</p>
            <p style={{ margin: '4px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>{product.stock} units available</p>
          </div>
          <button
            onClick={handleAdd}
            style={buttonStyle(added ? 'secondary' : 'primary', added ? { color: theme.colors.gold, borderColor: theme.colors.border } : {})}
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
