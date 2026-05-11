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
  statCardStyle,
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
          ...cardStyle({
            padding: '36px clamp(22px, 5vw, 42px)',
            display: 'grid',
            gap: 22,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))',
          }),
        }}
      >
        <p style={eyebrowStyle}>Online store</p>
        <div style={{ display: 'grid', gap: 14, maxWidth: 720 }}>
          <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(3rem, 7vw, 4.8rem)' }}>
            Shopping made clear, fast, and dependable.
          </h1>
          <p style={{ ...bodyStyle, fontSize: 16, maxWidth: 620 }}>
            Browse products, compare prices, and place orders in a clean storefront designed to feel professional on every screen.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          <div style={statCardStyle}>
            <p style={eyebrowStyle}>Catalog</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: theme.colors.text }}>500+</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Products across essential categories</p>
          </div>
          <div style={statCardStyle}>
            <p style={eyebrowStyle}>Delivery</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: theme.colors.text }}>24h</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Fast dispatch on selected items</p>
          </div>
          <div style={statCardStyle}>
            <p style={eyebrowStyle}>Support</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: theme.colors.text }}>7 days</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Order help and return guidance</p>
          </div>
        </div>
      </section>

      <section
        id="catalog"
        style={{
          marginTop: 24,
          ...cardStyle({
            padding: 18,
            display: 'grid',
            gap: 16,
            backdropFilter: 'blur(14px)',
          }),
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
              placeholder="Search products"
              style={inputStyle(false, { minWidth: 220 })}
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={inputStyle(false, { minWidth: 180 })}
            >
              <option value="featured">Featured</option>
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
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} style={cardStyle({ padding: 18 })}>
                <div style={skeletonStyle(220)} />
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
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
