import { useEffect, useState } from 'react';
import api from '../services/api';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  shipped:   'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders').then(res => setOrders(res.data));
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center mt-32 text-gray-400 text-xl">
        No orders yet
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-400">
                Order ID: <span className="font-mono">{order._id.slice(-8).toUpperCase()}</span>
              </p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-1 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <p className="text-sm text-gray-400">📍 {order.address}</p>
              <p className="font-bold text-indigo-600">Total: ₹{order.totalPrice}</p>
            </div>
            <p className="text-xs text-gray-300 mt-2">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;