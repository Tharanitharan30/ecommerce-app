import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import {
  badgeStyle,
  bodyStyle,
  buttonStyle,
  cardStyle,
  fadeUp,
  inputStyle,
  pageStyle,
  sectionTitleStyle,
  softCardStyle,
  theme,
} from '../theme';

function Field({ label, value }) {
  return (
    <div style={{ ...softCardStyle({ padding: 18 }) }}>
      <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.textMuted, fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ margin: '10px 0 0', color: theme.colors.text, fontSize: 17, fontWeight: 600 }}>
        {value || '-'}
      </p>
    </div>
  );
}

const requestTone = {
  none: 'default',
  pending: 'amber',
  approved: 'success',
  rejected: 'danger',
};

export default function Profile() {
  const { user, logout, setUser, refreshUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [requestingSeller, setRequestingSeller] = useState(false);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setAddress(user?.address || '');
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadSellerRequests();
    }
  }, [user?.role]);

  const loadSellerRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data } = await api.get('/auth/seller-requests');
      setSellerRequests(data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load seller requests.');
    }
    setLoadingRequests(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { data } = await api.put('/auth/me', { name, address });
      setUser(data);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }

    setSaving(false);
  };

  const handleSellerRequest = async () => {
    setRequestingSeller(true);
    setMessage('');

    try {
      const { data } = await api.post('/auth/request-seller');
      setUser(data);
      setMessage('Seller access request submitted for admin approval.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit seller request.');
    }

    setRequestingSeller(false);
  };

  const handleSellerDecision = async (requestUserId, action) => {
    setUpdatingRequestId(requestUserId);
    setMessage('');

    try {
      await api.put(`/auth/seller-requests/${requestUserId}`, { action });
      setSellerRequests((current) => current.filter((item) => item._id !== requestUserId));
      setMessage(`Seller request ${action}d successfully.`);
      await refreshUser();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update seller request.');
    }

    setUpdatingRequestId('');
  };

  const roleLabel = user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : '-';
  const sellerStatus = user?.sellerRequestStatus || 'none';
  const canRequestSeller = user?.role === 'user' && sellerStatus !== 'pending';

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <div style={{ display: 'grid', gap: 28 }}>
        <section
          style={cardStyle({
            padding: '32px clamp(20px, 4vw, 40px)',
            display: 'grid',
            gap: 20,
          })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'start' }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={badgeStyle(user?.role === 'admin' ? 'gold' : user?.role === 'seller' ? 'success' : 'default')}>
                  {user?.role === 'admin' ? 'Admin account' : user?.role === 'seller' ? 'Seller account' : 'Customer account'}
                </span>
                <span style={badgeStyle(requestTone[sellerStatus] || 'default')}>
                  Seller request: {sellerStatus}
                </span>
              </div>
              <div>
                <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(2.4rem, 5vw, 3.4rem)' }}>Profile</h1>
                <p style={{ ...bodyStyle, marginTop: 10 }}>
                  Review your account details, manage your address, and request seller access.
                </p>
              </div>
            </div>

            <button onClick={logout} style={buttonStyle('secondary')}>
              Sign Out
            </button>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Field label="Full Name" value={user?.name} />
          <Field label="Email Address" value={user?.email} />
          <Field label="Role" value={roleLabel} />
          <Field label="User ID" value={user?.id || user?._id} />
        </section>

        <section style={cardStyle({ padding: 24, display: 'grid', gap: 18 })}>
          <div>
            <h2 style={{ ...sectionTitleStyle, fontSize: '1.8rem' }}>Address</h2>
            <p style={{ ...bodyStyle, marginTop: 8 }}>
              This saved address will be used automatically during order placement and checkout.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <label style={labelStyle}>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                style={inputStyle(false)}
              />
            </label>

            <label style={labelStyle}>
              Delivery Address
              <textarea
                rows={5}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter your complete delivery address"
                style={inputStyle(false, { resize: 'vertical' })}
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving} style={buttonStyle('primary', saving ? { opacity: 0.65 } : {})}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </section>

        <section style={cardStyle({ padding: 24, display: 'grid', gap: 18 })}>
          <div>
            <h2 style={{ ...sectionTitleStyle, fontSize: '1.8rem' }}>Seller Access</h2>
            <p style={{ ...bodyStyle, marginTop: 8 }}>
              Request seller access to manage your own products and orders from the seller dashboard.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={badgeStyle(requestTone[sellerStatus] || 'default')}>
              {sellerStatus === 'none' && 'No request submitted'}
              {sellerStatus === 'pending' && 'Waiting for admin approval'}
              {sellerStatus === 'approved' && 'Seller access approved'}
              {sellerStatus === 'rejected' && 'Seller request rejected'}
            </span>

            {canRequestSeller && (
              <button
                onClick={handleSellerRequest}
                disabled={requestingSeller}
                style={buttonStyle('secondary', requestingSeller ? { opacity: 0.65 } : {})}
              >
                {requestingSeller ? 'Submitting...' : 'Request Seller Access'}
              </button>
            )}
          </div>
        </section>

        {message && (
          <p style={{ margin: 0, color: message.toLowerCase().includes('failed') || message.toLowerCase().includes('rejected') ? theme.colors.danger : theme.colors.success, fontSize: 14 }}>
            {message}
          </p>
        )}

        {user?.role === 'admin' && (
          <section style={cardStyle({ padding: 24, display: 'grid', gap: 16 })}>
            <div>
              <h2 style={{ ...sectionTitleStyle, fontSize: '1.8rem' }}>Seller Requests</h2>
              <p style={{ ...bodyStyle, marginTop: 8 }}>
                Review pending seller applications and approve the users who should manage products.
              </p>
            </div>

            {loadingRequests ? (
              <p style={bodyStyle}>Loading seller requests...</p>
            ) : sellerRequests.length === 0 ? (
              <p style={bodyStyle}>There are no pending seller requests right now.</p>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {sellerRequests.map((requestUser) => (
                  <div key={requestUser._id} style={softCardStyle({ padding: 18, display: 'grid', gap: 12 })}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'start' }}>
                      <div>
                        <p style={{ margin: 0, color: theme.colors.text, fontWeight: 700 }}>{requestUser.name}</p>
                        <p style={{ margin: '6px 0 0', color: theme.colors.textMuted, fontSize: 14 }}>{requestUser.email}</p>
                      </div>
                      <span style={badgeStyle('amber')}>Pending</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleSellerDecision(requestUser._id, 'approve')}
                        disabled={updatingRequestId === requestUser._id}
                        style={buttonStyle('primary', updatingRequestId === requestUser._id ? { opacity: 0.65 } : {})}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleSellerDecision(requestUser._id, 'reject')}
                        disabled={updatingRequestId === requestUser._id}
                        style={buttonStyle('secondary', updatingRequestId === requestUser._id ? { opacity: 0.65 } : {})}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </motion.div>
  );
}

const labelStyle = {
  display: 'grid',
  gap: 6,
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 600,
};
