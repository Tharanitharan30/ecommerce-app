import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState('');
  const { addToCart }           = useCartStore();

  useEffect(() => {
    api.get(`/products?search=${search}`)
      .then(res => setProducts(res.data));
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full border rounded px-4 py-2 mb-6"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
            <Link to={`/product/${p._id}`}>
              <div className="bg-gray-100 h-40 rounded flex items-center justify-center text-gray-400">
                {p.image ? <img src={p.image} alt={p.name} className="h-full object-cover" />
                         : 'No image'}
              </div>
              <h3 className="font-semibold mt-2">{p.name}</h3>
            </Link>
            <p className="text-indigo-600 font-bold">₹{p.price}</p>
            <button
              onClick={() => addToCart(p._id)}
              className="bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 text-sm">
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;