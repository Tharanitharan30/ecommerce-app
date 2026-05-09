import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

function ProductDetail() {
  const { id }          = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded]     = useState(false);
  const { addToCart }   = useCartStore();
  const { token }       = useAuthStore();
  const navigate        = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) return navigate('/login');
    await addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-8 p-6">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full md:w-80 h-72 object-cover rounded-xl"
        />
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <span className="text-sm text-indigo-500 font-medium">{product.category}</span>
          <p className="text-gray-500">{product.description}</p>
          <p className="text-3xl font-bold text-indigo-600">₹{product.price}</p>
          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`py-3 rounded-xl font-semibold text-white transition
              ${added ? 'bg-green-500'
              : product.stock === 0 ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50">
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;