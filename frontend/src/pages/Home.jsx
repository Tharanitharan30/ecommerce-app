import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  bodyStyle,
  buttonStyle,
  cardStyle,
  emptyStateStyle,
  eyebrowStyle,
  fadeUp,
  inputStyle,
  pageStyle,
  sectionTitleStyle,
  skeletonStyle,
  theme,
} from '../theme';

const categories = ['All', 'Electronics', 'Footwear', 'Clothing', 'Bags', 'Accessories'];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let canceled = false;

    api.get('/products')
      .then((response) => {
        if (canceled) return;
        setProducts(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') return [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, products, search, sortBy]);

  return (
    <motion.div {...fadeUp} style={pageStyle}>
      <section
        style={{
          minHeight: 'calc(100vh - 120px)',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: 24 }}>
            <p style={eyebrowStyle}>New Arrivals 2024</p>
            <div style={{ display: 'grid', gap: 16, maxWidth: 620 }}>
              <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(3rem, 7vw, 4.8rem)' }}>
                Curated precision. Unrivaled excellence.
              </h1>
              <p style={{ ...bodyStyle, fontSize: 18, maxWidth: 520 }}>
                Experience a cleaner retail flow where premium essentials, dependable checkout,
                and structured presentation work together like a modern luxury catalog.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#catalog" style={{ ...buttonStyle(), textDecoration: 'none' }}>
                Shop Collection
              </a>
              <button style={buttonStyle('secondary')}>View Journal</button>
            </div>
          </div>

          <div
            style={{
              ...cardStyle({
                minHeight: 520,
                overflow: 'hidden',
                background: theme.colors.surfaceAlt,
                position: 'relative',
              }),
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury watch"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', opacity: 0.92 }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: 128,
                height: 128,
                borderLeft: `1px solid ${theme.colors.border}`,
                borderBottom: `1px solid ${theme.colors.border}`,
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="catalog"
        style={{
          marginTop: 24,
          padding: '24px 0',
          borderTop: `1px solid ${theme.colors.border}`,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: 'rgba(249, 249, 249, 0.95)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <p style={eyebrowStyle}>Product catalog</p>
            <h2 style={{ ...sectionTitleStyle, fontSize: '2rem', marginTop: 8 }}>Browse products</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search collection"
              style={inputStyle(false, { minWidth: 240 })}
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={inputStyle(false, { minWidth: 180 })}
            >
              <option value="featured">Sort: Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                style={buttonStyle(active ? 'primary' : 'ghost', {
                  whiteSpace: 'nowrap',
                  padding: '10px 16px',
                })}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        {loading ? (
          <div
            style={{
              display: 'grid',
              gap: 24,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} style={cardStyle({ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' })}>
                <div style={skeletonStyle(300)} />
                <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                  <div style={skeletonStyle(14, { width: '30%' })} />
                  <div style={skeletonStyle(24, { width: '75%' })} />
                  <div style={skeletonStyle(16, { width: '55%' })} />
                  <div style={skeletonStyle(42, { width: '48%', borderRadius: 14, marginTop: 12 })} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: 42, color: theme.colors.textMuted }}>[]</div>
            <h3 style={{ margin: 0, fontSize: 32, color: theme.colors.text }}>No products found</h3>
            <p style={{ ...bodyStyle, maxWidth: 420 }}>
              Try another search term or switch categories to see more results.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setSortBy('featured');
              }}
              style={buttonStyle()}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 24,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}

export default Home;
