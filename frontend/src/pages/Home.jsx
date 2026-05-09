import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
            padding: '40px clamp(24px, 5vw, 48px)',
            display: 'grid',
            gap: 24,
            background:
              'radial-gradient(circle at top right, rgba(201,169,110,0.16), transparent 22%), linear-gradient(180deg, rgba(26,26,26,0.95), rgba(15,15,15,0.96))',
          }),
        }}
      >
        <p style={eyebrowStyle}>Curated Luxury Commerce</p>
        <div style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
          <h1 style={{ ...sectionTitleStyle, fontSize: 'clamp(3.4rem, 8vw, 5.7rem)' }}>
            Modern essentials for elevated living.
          </h1>
          <p style={{ ...bodyStyle, fontSize: 17, maxWidth: 620 }}>
            Discover premium electronics, fashion, and travel pieces with a refined shopping experience built for speed, clarity, and trust.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="#catalog" style={{ ...buttonStyle(), textDecoration: 'none' }}>Shop Collection</Link>
          <button style={buttonStyle('secondary')}>Explore New Arrivals</button>
        </div>
        <div
          style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          <div style={statCardStyle}>
            <p style={{ margin: 0, color: theme.colors.gold, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Catalog</p>
            <p style={{ margin: 0, fontSize: 34, fontWeight: 700, color: theme.colors.text }}>500+</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Products across premium categories</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ margin: 0, color: theme.colors.gold, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Community</p>
            <p style={{ margin: 0, fontSize: 34, fontWeight: 700, color: theme.colors.text }}>50K</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Shoppers choosing curated quality</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ margin: 0, color: theme.colors.gold, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Shipping</p>
            <p style={{ margin: 0, fontSize: 34, fontWeight: 700, color: theme.colors.text }}>24h</p>
            <p style={{ margin: 0, color: theme.colors.textMuted }}>Fast dispatch on selected products</p>
          </div>
        </div>
      </section>

      <section
        id="catalog"
        style={{
          position: 'sticky',
          top: 98,
          zIndex: 20,
          marginTop: 24,
          ...cardStyle({
            padding: 16,
            display: 'grid',
            gap: 16,
            backdropFilter: 'blur(18px)',
          }),
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <p style={eyebrowStyle}>Filter Bar</p>
            <h2 style={{ ...sectionTitleStyle, fontSize: '2.2rem', marginTop: 8 }}>Browse The Collection</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              style={{
                minWidth: 220,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: theme.colors.text,
                padding: '13px 16px',
              }}
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={{
                minWidth: 180,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: theme.colors.text,
                padding: '13px 16px',
              }}
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
                style={{
                  ...buttonStyle(active ? 'primary' : 'ghost', {
                    whiteSpace: 'nowrap',
                    padding: '12px 18px',
                  }),
                }}
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
                <div style={skeletonStyle(250)} />
                <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                  <div style={skeletonStyle(14, { width: '30%' })} />
                  <div style={skeletonStyle(26, { width: '75%' })} />
                  <div style={skeletonStyle(16, { width: '55%' })} />
                  <div style={skeletonStyle(46, { width: '48%', borderRadius: 999, marginTop: 12 })} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: 52 }}>◇</div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 42 }}>No products found</h3>
            <p style={{ ...bodyStyle, maxWidth: 420 }}>
              Try another search term or switch categories to discover more premium items.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setSortBy('featured');
              }}
              style={buttonStyle()}
            >
              Reset Filters
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
