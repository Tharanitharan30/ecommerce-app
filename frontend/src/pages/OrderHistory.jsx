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

  useEffect(() => {
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
  }, []);

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
          <div style={{ fontSize: 54 }}>◐</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 44 }}>No orders yet</h1>
          <p style={{ ...bodyStyle, maxWidth: 420 }}>
            Once you place an order, the full history and payment status will appear here.
          </p>
          <button onClick={() => navigate('/')} style={buttonStyle()}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ ...sectionTitleStyle, fontSize: '3.2rem' }}>Order History</h1>
        <p style={{ ...bodyStyle, marginTop: 8 }}>Track recent orders, payment confirmations, and delivery progress.</p>
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
                <span style={badgeStyle('gold')}>Payment Confirmed</span>
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

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
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
              <p style={{ margin: 0, color: theme.colors.gold, fontWeight: 700, fontSize: 24 }}>
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}

export default OrderHistory;
