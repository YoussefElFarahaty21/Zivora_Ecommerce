import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import OrderCard from '../../components/customer/OrderCard';
import Spinner from '../../components/ui/Spinner';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load your orders. Please try again.');
        console.error('OrderHistory fetchOrders error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-gray-500 text-sm">Loading your orders...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm text-blue-600 hover:underline mt-2">
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 font-medium text-lg">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">When you place orders, they'll appear here</p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
