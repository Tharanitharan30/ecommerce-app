import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import {
  bodyStyle,
  buttonStyle,
  cardStyle,
  emptyStateStyle,
  fadeUp,
  formatCurrency,
  inputStyle,
  pageStyle,
  quantityButtonStyle,
  sectionTitleStyle,
  skeletonStyle,
  theme,
} from '../theme';

function Cart() {
  const navigate = useNavigate();
  const { cart, fetchCart, updateItem, removeItem } = useCartStore();
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };

    load();
  }, [fetchCart]);

  const total = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  const handleOrder = async () => {
    if (!address.trim()) {
      alert('Please enter delivery address');
      return;
    }

    setOrdering(true);
    try {
      await api.post('/orders', { address });
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    }
    setOrdering(false);
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle({ padding: 20 })}>
          <div style={skeletonStyle(56, { marginBottom: 18 })} />
          <div style={skeletonStyle(220)} />
        </div>
      </div>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 40, color: theme.colors.textMuted }}>Cart</div>
          <h1 style={{ margin: 0, fontSize: 36, color: theme.colors.text }}>Your cart is empty</h1>
          <p style={{ ...bodyStyle, maxWidth: 420 }}>
            Add products to your cart and come back here to review quantities, totals, and delivery details.
          </p>
          <button onClick={() => navigate('/')} style={buttonStyle()}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ display: 'grid', gap: 24, alignItems: 'start', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 360px)' }}>
        <section style={cardStyle({ padding: 22, overflow: 'hidden' })}>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ ...sectionTitleStyle, fontSize: '2.6rem' }}>Your cart</h1>
            <p style={{ ...bodyStyle, marginTop: 8 }}>Review your selected items before placing the order.</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
              <thead>
                <tr style={{ color: theme.colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ textAlign: 'left', padding: '0 0 16px' }}>Product</th>
                  <th style={{ textAlign: 'left', padding: '0 0 16px' }}>Quantity</th>
                  <th style={{ textAlign: 'left', padding: '0 0 16px' }}>Price</th>
                  <th style={{ textAlign: 'left', padding: '0 0 16px' }}>Subtotal</th>
                  <th style={{ textAlign: 'right', padding: '0 0 16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product._id} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                    <td style={{ padding: '18px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={item.product.image || 'https://via.placeholder.com/80'} alt={item.product.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16 }} />
                        <div>
                          <p style={{ margin: 0, color: theme.colors.text, fontWeight: 700 }}>{item.product.name}</p>
                          <p style={{ margin: '6px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>{item.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '18px 0' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateItem(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ ...quantityButtonStyle, opacity: item.quantity <= 1 ? 0.4 : 1 }}>-</button>
                        <span style={{ minWidth: 26, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateItem(item.product._id, item.quantity + 1)} style={quantityButtonStyle}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: '18px 0', color: theme.colors.textMuted }}>{formatCurrency(item.product.price)}</td>
                    <td style={{ padding: '18px 0', color: theme.colors.text, fontWeight: 800 }}>{formatCurrency(item.product.price * item.quantity)}</td>
                    <td style={{ padding: '18px 0', textAlign: 'right' }}>
                      <button onClick={() => removeItem(item.product._id)} style={buttonStyle('ghost')}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside style={{ position: 'sticky', top: 104, ...cardStyle({ padding: 22 }) }}>
          <h2 style={{ ...sectionTitleStyle, fontSize: '2rem' }}>Order summary</h2>
          <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.colors.textMuted }}>
              <span>Items</span>
              <span>{cart.items.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.colors.textMuted }}>
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.colors.text, fontSize: 24, fontWeight: 800, marginTop: 6 }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <textarea
            rows={5}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter delivery address"
            style={{ ...inputStyle(false, { marginTop: 18, resize: 'vertical' }) }}
          />

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <button onClick={handleOrder} disabled={ordering} style={buttonStyle('primary', ordering ? { opacity: 0.65 } : {})}>
              {ordering ? 'Placing order...' : 'Place order'}
            </button>
            <button onClick={() => navigate('/checkout')} style={buttonStyle('secondary')}>
              Proceed to checkout
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

export default Cart;
