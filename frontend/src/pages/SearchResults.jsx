import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, fetchProducts, addToCart, token } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('Featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
    setSelectedCategory(params.get('category') || '');
  }, [location.search]);

  // Handle category change
  const handleCategoryToggle = (categoryName) => {
    const newCat = selectedCategory === categoryName ? '' : categoryName;
    setSelectedCategory(newCat);
    updateURL(searchQuery, newCat);
  };

  const updateURL = (q, cat) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    navigate(`/search?${params.toString()}`);
  };

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

  // Filter & Sort Products
  const filteredProducts = products
    .filter((prod) => {
      // Search Query filter
      if (
        searchQuery &&
        !prod.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prod.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Category filter
      if (selectedCategory && prod.category !== selectedCategory) {
        return false;
      }
      // Price range filters
      if (minPrice && prod.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && prod.price > Number(maxPrice)) {
        return false;
      }
      // Stock availability filter
      if (inStockOnly && prod.stock <= 0) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'Price: Low to High') {
        return a.price - b.price;
      }
      if (sortOption === 'Price: High to Low') {
        return b.price - a.price;
      }
      if (sortOption === 'Customer Rating') {
        return b.createdAt.localeCompare(a.createdAt); // Mock rating order
      }
      if (sortOption === 'Newest Arrivals') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return 0; // Featured / Default
    });

  const categories = ['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories'];

  return (
    <div className="space-y-md animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs text-on-surface-variant text-[11px] mb-sm">
        <Link className="hover:text-primary transition-colors font-medium" to="/">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-semibold">Search Results</span>
      </nav>

      {/* Title and Sort */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
        <div>
          <h1 className="font-headline text-3xl font-black text-primary">
            {selectedCategory || 'Catalog Products'}
          </h1>
          <p className="text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> results
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        <div className="flex items-center gap-md">
          <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap" htmlFor="sort">
            Sort by:
          </label>
          <select
            className="bg-white border border-outline-variant px-md py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none min-w-[200px]"
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Customer Rating</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-xl">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-xl bg-white border border-outline-variant p-lg rounded-xl h-fit card-shadow">
          {/* Categories */}
          <section>
            <h3 className="font-headline text-base font-bold mb-md border-b border-outline-variant/30 pb-xs text-primary">
              Categories
            </h3>
            <ul className="space-y-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-sm cursor-pointer group text-sm text-on-surface">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => handleCategoryToggle(cat)}
                      className="rounded text-primary focus:ring-primary h-4 w-4 border-outline-variant"
                    />
                    <span className="group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Price Range */}
          <section>
            <h3 className="font-headline text-base font-bold mb-md border-b border-outline-variant/30 pb-xs text-primary">
              Price Range
            </h3>
            <div className="flex items-center gap-sm mb-md">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant px-sm py-1.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-on-surface-variant text-xs font-semibold">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant px-sm py-1.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {/* Quick Price Shortcuts */}
            <div className="space-y-sm text-sm">
              <label className="flex items-center gap-sm cursor-pointer group text-on-surface">
                <input
                  type="radio"
                  name="price"
                  onChange={() => {
                    setMinPrice('0');
                    setMaxPrice('500');
                  }}
                  className="text-primary focus:ring-primary h-4 w-4 border-outline-variant"
                />
                <span className="group-hover:text-primary transition-colors">Under Rs 500</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group text-on-surface">
                <input
                  type="radio"
                  name="price"
                  onChange={() => {
                    setMinPrice('500');
                    setMaxPrice('2000');
                  }}
                  className="text-primary focus:ring-primary h-4 w-4 border-outline-variant"
                />
                <span className="group-hover:text-primary transition-colors">Rs 500 - Rs 2,000</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group text-on-surface">
                <input
                  type="radio"
                  name="price"
                  onChange={() => {
                    setMinPrice('2000');
                    setMaxPrice('');
                  }}
                  className="text-primary focus:ring-primary h-4 w-4 border-outline-variant"
                />
                <span className="group-hover:text-primary transition-colors">Over Rs 2,000</span>
              </label>
            </div>
          </section>

          {/* Availability */}
          <section className="pt-md border-t border-outline-variant/30">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-bold text-sm text-primary">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant"
              />
            </label>
          </section>
        </aside>

        {/* Main Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-outline-variant p-xl text-center card-shadow">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-md">
                sentiment_dissatisfied
              </span>
              <h3 className="font-headline text-lg font-bold text-primary mb-sm">No Products Found</h3>
              <p className="text-on-surface-variant text-sm mb-lg">
                We couldn't find any products matching your current filters.
              </p>
              <button
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedCategory('');
                  setInStockOnly(false);
                  updateURL('', '');
                }}
                className="bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="product-card group bg-white border border-outline-variant hover:shadow-lg transition-all duration-300 flex flex-col relative rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${prod._id}`)}
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-container-low flex items-center justify-center p-2">
                    <img
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
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
                  <div className="p-md flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-[10px] text-secondary tracking-wider uppercase">
                        {prod.category}
                      </span>
                      <h3 className="font-bold text-on-surface line-clamp-2 text-sm group-hover:text-secondary transition-colors">
                        {prod.name}
                      </h3>
                      <div className="flex text-secondary mb-xs">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-xs"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center justify-between">
                      <span className="font-bold text-primary text-base">
                        Rs {prod.price.toLocaleString('en-IN')}
                      </span>
                      {prod.stock <= 0 && (
                        <span className="text-[10px] bg-error-container text-on-error-container font-semibold px-2 py-0.5 rounded-full border border-error/10">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
