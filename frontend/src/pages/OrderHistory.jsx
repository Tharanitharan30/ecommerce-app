import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
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
  statusTone,
  theme,
} from '../theme';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState('');

  const loadOrders = () => {
    let canceled = false;

    api.get('/orders/myorders')
      .then((response) => {
        if (canceled) return;
        setOrders(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  };

  useEffect(() => {
    return loadOrders();
  }, []);

  const handlePayNow = async (order) => {
    setPayingOrderId(order._id);

    try {
      const { data } = await api.post(`/orders/${order._id}/pay`);
      if (typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay SDK failed to load');
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Ecommerce',
        description: `Payment for order ${order._id.slice(-6).toUpperCase()}`,
        handler: async (response) => {
          await api.post(`/orders/${order._id}/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          setOrders((current) => current.map((item) => (
            item._id === order._id
              ? { ...item, isPaid: true, paymentId: response.razorpay_payment_id }
              : item
          )));
          setPayingOrderId('');
        },
        theme: { color: '#000e24' },
        modal: {
          ondismiss: () => setPayingOrderId(''),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', () => {
        setPayingOrderId('');
        alert('Payment failed. Please try again.');
      });
    } catch (error) {
      setPayingOrderId('');
      console.error('Pending payment start failed:', error);
      const backendMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message;
      alert(backendMessage || error.message || 'Unable to start payment');
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ display: 'grid', gap: 18 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={cardStyle({ padding: 22 })}>
              <div style={skeletonStyle(24, { width: '35%' })} />
              <div style={skeletonStyle(70, { marginTop: 16 })} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 40, color: theme.colors.textMuted }}>Orders</div>
          <h1 style={{ margin: 0, fontSize: 36, color: theme.colors.text }}>No orders yet</h1>
          <p style={{ ...bodyStyle, maxWidth: 420 }}>
            Once you place an order, the full history and payment status will appear here.
          </p>
          <button onClick={() => navigate('/')} style={buttonStyle()}>
            Start shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(2.4rem, 4vw, 3rem)' }}>My Orders</h1>
          <p style={{ ...bodyStyle, marginTop: 8 }}>Track recent orders, payment confirmations, and delivery progress.</p>
        </div>
        <button style={buttonStyle('ghost')}>Filter</button>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {orders.map((order) => (
          <article key={order._id} style={cardStyle({ padding: 22 })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: 13 }}>Order ID</p>
                <code style={{ color: theme.colors.text, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 14 }}>
                  {order._id.toUpperCase()}
                </code>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={badgeStyle(statusTone[order.status] || 'default')}>{order.status}</span>
                <span style={badgeStyle(order.isPaid ? 'gold' : 'amber')}>
                  {order.isPaid ? 'Payment confirmed' : 'Pending payment'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
              {order.items.map((item, index) => (
                <div key={`${item.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: theme.colors.textMuted }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: 13 }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p style={{ margin: '6px 0 0', color: theme.colors.textMuted, fontSize: 14 }}>{order.address}</p>
              </div>
              <p style={{ margin: 0, color: theme.colors.text, fontWeight: 800, fontSize: 22 }}>
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
              {!order.isPaid && (
                <button
                  onClick={() => handlePayNow(order)}
                  disabled={payingOrderId === order._id}
                  style={buttonStyle('secondary', payingOrderId === order._id ? { opacity: 0.65 } : {})}
                >
                  {payingOrderId === order._id ? 'Processing...' : 'Pay now'}
                </button>
              )}
              <button style={buttonStyle('secondary')}>Track Order</button>
              <button style={buttonStyle()}>View Details</button>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}

export default OrderHistory;
