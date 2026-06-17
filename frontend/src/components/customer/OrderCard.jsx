import { useState } from 'react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 font-mono">#{order.id}</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={order.status}>{order.status}</Badge>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/40x40?text=Img'}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg bg-white border border-gray-200"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=Img'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-200 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
