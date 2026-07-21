import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart, fetchCart, token } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  // Sync search input with URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="bg-white dark:bg-surface-container-high border-b border-outline-variant dark:border-outline shadow-sm full-width top-0 sticky z-50">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col w-full">
        <div className="flex items-center justify-between h-16">
          {/* Brand Anchor */}
          <Link
            to="/"
            className="font-headline font-black text-2xl text-primary tracking-tighter"
          >
            ProMarket
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 px-md pl-10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface"
              />
              <button
                type="submit"
                className="absolute left-3 top-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </form>

          {/* Trailing Actions */}
          <div className="flex items-center gap-md">
            <Link
              to="/cart"
              className="p-2 text-on-surface hover:text-secondary transition-colors relative flex items-center"
            >
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/account"
                className="p-2 text-on-surface hover:text-secondary transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-2xl">person</span>
                <span className="hidden sm:inline text-xs font-semibold max-w-[80px] truncate">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="p-2 text-on-surface hover:text-secondary transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-2xl">login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-lg py-2 border-t border-outline-variant/30">
          <Link
            to="/"
            className={`pb-1 text-sm font-semibold transition-colors ${
              location.pathname === '/'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Home
          </Link>
          {['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories'].map((cat) => {
            const isActive = new URLSearchParams(location.search).get('category') === cat;
            return (
              <Link
                key={cat}
                to={`/search?category=${cat}`}
                className={`pb-1 text-sm transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
