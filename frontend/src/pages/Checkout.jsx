import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  sectionTitleStyle,
  skeletonStyle,
  theme,
} from '../theme';

function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };

    load();
  }, [fetchCart]);

  const total = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const deliveryAddress = user?.address?.trim() || '';

  const handlePayment = async () => {
    if (!deliveryAddress) {
      alert('Please add your delivery address in profile');
      return;
    }

    setPaying(true);
    try {
      const { data } = await api.post('/orders/pay', { amount: total });
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Ecommerce',
        description: 'Order payment',
        handler: async (response) => {
          const cartItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          }));

          await api.post('/orders/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cartItems,
            totalPrice: total,
            address: deliveryAddress,
          });

          clearCart();
          navigate('/orders');
        },
        theme: { color: '#2563eb' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
    setPaying(false);
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle({ padding: 20 })}>
          <div style={skeletonStyle(64, { marginBottom: 18 })} />
          <div style={skeletonStyle(220)} />
        </div>
      </div>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 40, color: theme.colors.textMuted }}>Pay</div>
          <h1 style={{ margin: 0, fontSize: 36, color: theme.colors.text }}>Checkout is empty</h1>
          <p style={{ ...bodyStyle, maxWidth: 420 }}>
            Add items to your cart before starting the payment flow.
          </p>
          <button onClick={() => navigate('/')} style={buttonStyle()}>
            Shop now
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 360px)' }}>
        <section style={cardStyle({ padding: 24 })}>
          <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(2.4rem, 4vw, 3rem)' }}>Checkout</h1>
          <p style={{ ...bodyStyle, marginTop: 8 }}>Review your items and pay securely with Razorpay.</p>

          <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: theme.colors.surfaceAlt,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div>
                  <p style={{ margin: 0, color: theme.colors.text, fontWeight: 700 }}>{item.product.name}</p>
                  <p style={{ margin: '4px 0 0', color: theme.colors.textMuted, fontSize: 13 }}>Qty {item.quantity}</p>
                </div>
                <p style={{ margin: 0, color: theme.colors.text, fontWeight: 800 }}>{formatCurrency(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={cardStyle({ padding: 16, background: theme.colors.surfaceAlt })}>
              <p style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.colors.textMuted, fontWeight: 600 }}>
                Delivery address
              </p>
              <p style={{ ...bodyStyle, marginTop: 10, color: deliveryAddress ? theme.colors.text : theme.colors.textMuted }}>
                {deliveryAddress || 'No address saved in your profile yet.'}
              </p>
              <button onClick={() => navigate('/profile')} style={{ ...buttonStyle('ghost'), marginTop: 14 }}>
                Edit address
              </button>
            </div>
          </div>
        </section>

        <aside style={{ position: 'sticky', top: 104, ...cardStyle({ padding: 24 }) }}>
          <h2 style={{ ...sectionTitleStyle, fontSize: '2rem' }}>Payment</h2>
          <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.colors.textMuted }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div style={badgeStyle('gold')}>Secured by Razorpay</div>
          </div>

          <button onClick={handlePayment} disabled={paying} style={{ ...buttonStyle('primary', paying ? { opacity: 0.65 } : {}), width: '100%', marginTop: 22 }}>
            {paying ? 'Processing...' : `Pay ${formatCurrency(total)}`}
          </button>
          <p style={{ ...bodyStyle, marginTop: 14, fontSize: 13 }}>
            Payment is verified after completion and successful orders appear in your history.
          </p>
        </aside>
      </div>
    </motion.div>
  );
}

export default Checkout;
