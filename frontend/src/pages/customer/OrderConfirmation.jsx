import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../../services/orderService';
import CheckoutSteps from '../../components/customer/CheckoutSteps';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details.');
        console.error('OrderConfirmation fetchOrder error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Order Confirmation</h1>
        <CheckoutSteps currentStep={2} />

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center space-y-5">
          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Placed Successfully!</h2>
            <p className="text-gray-500 text-sm mt-1">
              Thank you for your purchase. We'll send you a confirmation email shortly.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : order ? (
            <div className="text-left space-y-4">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono text-xs text-gray-700">#{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="capitalize font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-xs">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping To</span>
                  <span className="text-gray-700 text-right max-w-[60%]">
                    {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/40x40?text=Img'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-50"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=Img'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total Paid</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 py-3 text-center border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="flex-1 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
