import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import OrderRow from '../../components/admin/OrderRow';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders.');
      console.error('Admin Orders fetchOrders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setDetailModal(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Admin Orders handleStatusChange error:', err);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} orders total</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <OrderRow key={order.id} order={order} onView={handleView} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Order Header */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500 font-mono">#{selectedOrder.id}</p>
                  <p className="text-sm text-gray-600">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                  {updatingStatus && <Spinner size="sm" />}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium text-gray-800">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-medium text-gray-800">Email:</span> {selectedOrder.customerEmail}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</p>
                <p className="mt-1 text-xs text-blue-600">{selectedOrder.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/40x40?text=Img'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-50"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=Img'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">× {item.quantity} @ {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
