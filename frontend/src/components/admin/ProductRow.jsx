import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/40x40?text=Img'}
            alt={product.name}
            className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=Img'; }}
          />
          <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 10
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
