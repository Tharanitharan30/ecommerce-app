import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';

function Checkout() {
  const [address, setAddress]   = useState('');
  const [loading, setLoading]   = useState(false);
  const { cart, fetchCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const total = cart?.items?.reduce(
    (sum, i) => sum + i.product.price * i.quantity, 0
  ) || 0;

  const handlePayment = async () => {
    if (!address.trim()) return alert('Please enter delivery address');
    setLoading(true);

    try {
      // Step 1 — create Razorpay order on backend
      const { data } = await api.post('/orders/pay', { amount: total });

      // Step 2 — open Razorpay popup
      const options = {
        key:      data.key,
        amount:   data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name:     'ShopApp',
        description: 'Order Payment',

        handler: async (response) => {
          // Step 3 — payment success, verify on backend
          const cartItems = cart.items.map(i => ({
            product:  i.product._id,
            name:     i.product.name,
            quantity: i.quantity,
            price:    i.product.price,
          }));

          await api.post('/orders/verify', {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            cartItems,
            totalPrice: total,
            address,
          });

          clearCart();
          alert('Payment successful! Order placed.');
          navigate('/orders');
        },

        prefill: {
          name:  'Customer',
          email: 'customer@example.com',
        },
        theme: { color: '#6366f1' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
      });

    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }

    setLoading(false);
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="text-center mt-32 text-gray-400">
        <p className="text-xl mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Order summary */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
        {cart.items.map(item => (
          <div key={item.product._id}
            className="flex justify-between text-sm text-gray-600 py-2 border-b last:border-0">
            <span>{item.product.name} × {item.quantity}</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span className="text-indigo-600">₹{total}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Delivery Address</h2>
        <textarea
          rows={4}
          placeholder="Enter your full delivery address..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg
          hover:bg-indigo-700 disabled:opacity-50 transition">
        {loading ? 'Processing...' : `Pay ₹${total}`}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Secured by Razorpay 🔒
      </p>
    </div>
  );
}

export default Checkout;