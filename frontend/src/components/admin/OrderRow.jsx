import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function OrderRow({ order, onView }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          #{order.id.slice(-8)}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
        <p className="text-xs text-gray-500">{order.customerEmail}</p>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
      <td className="px-4 py-3">
        <Badge variant={order.status}>{order.status}</Badge>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onView(order)}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View
        </button>
      </td>
    </tr>
  );
}
