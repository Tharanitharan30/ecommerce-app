import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Home() {
  const navigate = useNavigate();
  const { products, fetchProducts, addToCart, token } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = async (productId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart!');
    }
  };

  // Select some categories and products for home content
  const bestSellers = products.slice(0, 4);
  const recommended = products.slice(2, 6);

  const categories = [
    { name: 'Electronics', icon: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150' },
    { name: 'Clothing', icon: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150' },
    { name: 'Footwear', icon: 'checkroom', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150' },
    { name: 'Bags', icon: 'backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150' },
    { name: 'Accessories', icon: 'watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150' },
  ];

  return (
    <div className="space-y-xl animate-fade-in">
      {/* Hero Banner */}
      <section className="relative h-[450px] rounded-xl overflow-hidden group border border-outline-variant/30">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-transparent flex items-center">
          <div className="p-xl md:pl-24 max-w-2xl text-white">
            <span className="inline-block px-3 py-1 bg-secondary text-on-secondary font-semibold text-xs rounded-full mb-md">
              SEASONAL SPECIAL
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black mb-md leading-tight">
              Upgrade Your <br />Home Office
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-xl max-w-lg">
              Redefine your workspace with our curated collection of ergonomic essentials and professional hardware. Up to 40% off for a limited time.
            </p>
            <div className="flex gap-md">
              <button
                onClick={() => navigate('/search')}
                className="bg-secondary text-on-secondary px-lg py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Shop Sale <span className="material-symbols-outlined">trending_flat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex justify-between items-end mb-lg">
          <h2 className="font-headline text-2xl font-bold text-primary">Shop by Category</h2>
          <Link to="/search" className="text-secondary font-bold text-sm hover:underline">
            View All Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-md">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/search?category=${cat.name}`} className="group text-center">
              <div className="aspect-square rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center mb-md overflow-hidden card-shadow-hover relative p-2">
                <img
                  className="w-4/5 h-4/5 object-cover rounded-full group-hover:scale-110 transition-transform duration-350"
                  src={cat.image}
                  alt={cat.name}
                />
              </div>
              <span className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bento Grid: Deals & Countdown */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="md:col-span-2 bg-primary-container text-white rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30 min-h-[300px]">
          <div className="relative z-10 space-y-md">
            <h3 className="font-headline text-2xl font-bold">Flash Sale: Smart Home</h3>
            <p className="text-on-primary-container text-sm md:text-base max-w-md">
              Save up to 60% on our top-rated smart security and lighting solutions.
            </p>
            <div className="flex gap-md pt-2">
              <div className="bg-white/10 backdrop-blur-md px-md py-sm rounded-lg text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase text-white/70">Hours</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-md py-sm rounded-lg text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase text-white/70">Mins</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-md py-sm rounded-lg text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase text-white/70">Secs</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="bg-secondary text-on-secondary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Shop All Deals
            </button>
          </div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558002038-1055907df827?w=800')",
            }}
          ></div>
        </div>

        <div className="bg-secondary-container text-on-secondary-container rounded-xl p-lg flex flex-col justify-between border border-outline-variant card-shadow">
          <div className="space-y-sm">
            <h3 className="font-headline text-xl font-bold text-primary">Student Discount</h3>
            <p className="text-sm text-on-surface-variant">
              Verify your student status and unlock an extra 15% off across all electronics.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-lg flex items-center justify-between border border-outline-variant mt-4">
            <span className="font-bold text-secondary tracking-wide">UNIDAYS-15</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('UNIDAYS-15');
                alert('Coupon code copied!');
              }}
              className="text-primary hover:text-secondary font-bold text-sm transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section>
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">Best Selling Products</h2>
            <p className="text-xs text-on-surface-variant">The most popular picks from our catalog this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
          {bestSellers.map((prod) => (
            <div
              key={prod._id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/product/${prod._id}`)}
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-surface-container-low flex items-center justify-center p-2">
                <img
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-350"
                  src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                  alt={prod.name}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(prod._id);
                  }}
                  className="absolute bottom-3 right-3 bg-secondary text-on-secondary w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
              <div className="p-md space-y-1">
                <span className="font-semibold text-[10px] text-secondary tracking-wider uppercase">
                  {prod.category}
                </span>
                <h4 className="font-bold text-on-surface line-clamp-1 text-sm">{prod.name}</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-secondary text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span className="material-symbols-outlined text-outline text-xs">star</span>
                  <span className="text-[10px] text-on-surface-variant ml-1">(4.5)</span>
                </div>
                <p className="font-bold text-primary text-base">Rs {prod.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="bg-surface-container-low rounded-2xl p-lg border border-outline-variant">
        <div className="text-center mb-xl">
          <h2 className="font-headline text-2xl font-bold text-primary">Recommended For You</h2>
          <p className="text-xs text-on-surface-variant">Based on your recent browsing and interests.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {recommended.map((prod) => (
            <div
              key={prod._id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/${prod._id}`)}
            >
              <img
                className="w-full h-44 object-cover"
                src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                alt={prod.name}
              />
              <div className="p-md flex-1 flex flex-col justify-between space-y-md">
                <div>
                  <h4 className="font-bold text-on-surface line-clamp-1 text-sm">{prod.name}</h4>
                  <p className="text-on-surface-variant text-xs mt-1">{prod.category}</p>
                </div>
                <div className="flex justify-between items-center pt-md border-t border-outline-variant/30">
                  <span className="font-bold text-primary text-sm">
                    Rs {prod.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(prod._id);
                    }}
                    className="bg-primary text-on-primary w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary-container transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-xl">
        <h2 className="font-headline text-2xl font-bold text-center text-primary mb-xl">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-white p-lg rounded-xl card-shadow border border-outline-variant space-y-md">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-secondary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="italic text-on-surface text-sm leading-relaxed">
              "The home office collection completely transformed my daily workflow. High-quality products and the shipping was incredibly fast."
            </p>
            <div className="flex items-center gap-md">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-xs">Sarah J.</p>
                <p className="text-[10px] text-on-surface-variant">Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-lg rounded-xl card-shadow border border-outline-variant space-y-md">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-secondary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="italic text-on-surface text-sm leading-relaxed">
              "I was skeptical about ordering furniture online, but the assembly was simple and the build quality exceeded all my expectations."
            </p>
            <div className="flex items-center gap-md">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-xs">Michael R.</p>
                <p className="text-[10px] text-on-surface-variant">Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-lg rounded-xl card-shadow border border-outline-variant space-y-md">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-secondary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
              <span className="material-symbols-outlined text-outline text-sm">star</span>
            </div>
            <p className="italic text-on-surface text-sm leading-relaxed">
              "Excellent customer service. Had a small issue with my order and they resolved it within an hour. Highly recommended!"
            </p>
            <div className="flex items-center gap-md">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-xs">Emily L.</p>
                <p className="text-[10px] text-on-surface-variant">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
