import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Account() {
  const navigate = useNavigate();
  const { user, orders, fetchOrders, logout, updateProfile, requestSeller, token } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [user]);

  if (!token) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg p-lg space-y-md">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
        <h3 className="font-headline text-lg font-bold text-primary">Access Denied</h3>
        <p className="text-on-surface-variant text-sm">Please log in to manage your profile and orders.</p>
        <Link
          to="/login"
          className="inline-block bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfile({ name, email, address });
    setLoading(false);
    if (success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  const handleRequestSeller = async () => {
    if (confirm('Are you sure you want to request seller access?')) {
      const success = await requestSeller();
      if (success) {
        alert('Seller request submitted successfully!');
      } else {
        alert('Request failed.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row gap-lg animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="flex flex-col gap-xs sticky top-24 bg-white p-md border border-outline-variant rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('Dashboard')}
            className={`flex items-center gap-md px-md py-3 rounded-lg w-full text-left transition-colors ${
              activeTab === 'Dashboard'
                ? 'bg-surface-container-low font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('Orders')}
            className={`flex items-center gap-md px-md py-3 rounded-lg w-full text-left transition-colors ${
              activeTab === 'Orders'
                ? 'bg-surface-container-low font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm">My Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('Settings')}
            className={`flex items-center gap-md px-md py-3 rounded-lg w-full text-left transition-colors ${
              activeTab === 'Settings'
                ? 'bg-surface-container-low font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </button>
          <div className="my-sm border-t border-outline-variant/30"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-md px-md py-3 rounded-lg text-error hover:bg-error-container/10 transition-colors w-full text-left font-bold"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 space-y-lg">
        {/* Welcome Section */}
        <div className="bg-primary rounded-xl p-lg md:p-xl text-on-primary relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <h1 className="font-headline text-2xl md:text-3xl font-black text-white">
              Welcome back, {user?.name || 'Customer'}
            </h1>
            <p className="text-sm text-white/80 mt-2">
              Role: <span className="font-bold capitalize">{user?.role}</span>
              {user?.sellerRequestStatus === 'pending' && ' • Seller request pending approval'}
            </p>
          </div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-secondary rounded-full opacity-10"></div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary-fixed rounded-full opacity-20"></div>
        </div>

        {/* Dynamic Panels */}
        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Recent Orders Overview */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-headline text-base font-bold text-primary">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab('Orders')}
                  className="text-secondary font-bold text-xs hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-sm">
                {orders.length === 0 ? (
                  <p className="text-xs text-on-surface-variant">No orders placed yet.</p>
                ) : (
                  orders.slice(0, 2).map((order) => (
                    <div
                      key={order._id}
                      className="p-sm bg-surface-container border border-outline-variant rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-primary">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xs text-primary">
                          Rs {order.totalPrice.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[9px] font-bold uppercase text-secondary">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Profile Overview & Actions */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <h2 className="font-headline text-base font-bold text-primary">Profile Info</h2>
              <div className="text-xs space-y-2 text-on-surface-variant">
                <p>
                  <strong className="text-primary">Name:</strong> {user?.name}
                </p>
                <p>
                  <strong className="text-primary">Email:</strong> {user?.email}
                </p>
                <p>
                  <strong className="text-primary">Shipping:</strong> {user?.address || 'No address configured'}
                </p>
              </div>
              {user?.role === 'user' && user?.sellerRequestStatus === 'none' && (
                <div className="pt-sm">
                  <button
                    onClick={handleRequestSeller}
                    className="w-full py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  >
                    Request Seller Access
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Orders' && (
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
            <h2 className="font-headline text-lg font-bold text-primary">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-xl text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-4xl block mb-sm">receipt_long</span>
                No orders placed yet.
              </div>
            ) : (
              <div className="space-y-md">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-outline-variant rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="bg-surface-container p-sm md:p-md flex justify-between items-center flex-wrap gap-sm border-b border-outline-variant">
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-primary">
                          ORDER ID: <span className="font-medium">#{order._id}</span>
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-bold text-primary">
                          Total: Rs {order.totalPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          Status:{' '}
                          <span className="font-bold uppercase text-secondary">{order.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-md space-y-sm text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-md border-b border-outline-variant/10 pb-sm last:border-b-0 last:pb-0">
                          <div>
                            <p className="font-bold text-primary">{item.name}</p>
                            <p className="text-on-surface-variant text-[10px]">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-primary">Rs {item.price.toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                      <div className="pt-sm text-[10px] text-on-surface-variant border-t border-outline-variant/30 flex justify-between items-center flex-wrap gap-sm">
                        <p>
                          <strong>Shipping To:</strong> {order.address}
                        </p>
                        <p className="bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-outline-variant/30">
                          Payment: {order.isPaid ? 'PAID ONLINE' : 'COD / UNPAID'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
            <h2 className="font-headline text-lg font-bold text-primary">Account Settings</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-md max-w-lg">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Shipping Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary resize-none"
                  placeholder="Street Address, City, Pincode"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-xl py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all text-xs"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
