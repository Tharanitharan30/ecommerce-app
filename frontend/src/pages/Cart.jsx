import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function Cart() {
  const { cart, fetchCart, updateItem, removeItem } = useCartStore();
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const total = cart?.items?.reduce(
    (sum, i) => sum + i.product.price * i.quantity, 0
  ) || 0;

  const handleOrder = async () => {
    if (!address.trim()) return alert('Please enter delivery address');
    setOrdering(true);
    try {
      const { default: api } = await import('../services/api');
      await api.post('/orders', { address });
      await fetchCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    }
    setOrdering(false);
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="text-center mt-32">
        <p className="text-2xl text-gray-400 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4 mb-6">
        {cart.items.map(item => (
          <div key={item.product._id}
            className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
            <img
              src={item.product.image || 'https://via.placeholder.com/80'}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
              <p className="text-indigo-600 font-bold">₹{item.product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateItem(item.product._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full border text-lg font-bold
                  flex items-center justify-center hover:bg-gray-100 disabled:opacity-30">
                −
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.product._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border text-lg font-bold
                  flex items-center justify-center hover:bg-gray-100">
                +
              </button>
            </div>
            <p className="font-bold text-gray-700 w-20 text-right">
              ₹{item.product.price * item.quantity}
            </p>
            <button
              onClick={() => removeItem(item.product._id)}
              className="text-red-400 hover:text-red-600 text-xl ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Checkout section */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-indigo-600">₹{total}</span>
        </div>
        <textarea
          placeholder="Enter delivery address..."
          rows={3}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        // In Cart.jsx replace the Place Order button with:
        <button
        onClick={() => navigate('/checkout')}
        className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">
        Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}

export default Cart;