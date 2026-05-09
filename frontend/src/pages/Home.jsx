import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [added, setAdded]       = useState('');
  const { addToCart }           = useCartStore();
  const { token }               = useAuthStore();

  const categories = ['All', 'Electronics', 'Footwear', 'Clothing', 'Bags', 'Accessories'];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search)              params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    api.get(`/products?${params}`).then(res => setProducts(res.data));
  }, [search, category]);

  const handleAddToCart = async (productId, productName) => {
    if (!token) return alert('Please login to add items to cart');
    await addToCart(productId);
    setAdded(productId);
    setTimeout(() => setAdded(''), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input type="text" placeholder="Search products..."
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition
                ${category === cat || (cat === 'All' && !category)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'text-gray-600 border-gray-300 hover:border-indigo-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col">
            <Link to={`/product/${p._id}`}>
              <img
                src={p.image || 'https://via.placeholder.com/300'}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
            </Link>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <Link to={`/product/${p._id}`}>
                <h3 className="font-semibold text-gray-800 hover:text-indigo-600">{p.name}</h3>
              </Link>
              <p className="text-xs text-gray-400">{p.category}</p>
              <p className="text-indigo-600 font-bold text-lg">₹{p.price}</p>
              <p className="text-xs text-gray-400">Stock: {p.stock}</p>
              <button
                onClick={() => handleAddToCart(p._id, p.name)}
                className={`mt-auto py-2 rounded-lg text-sm font-medium transition
                  ${added === p._id
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {added === p._id ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;