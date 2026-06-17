import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-sm font-bold text-blue-600">{formatCurrency(product.price)}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-300 min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{formatCurrency(product.price * quantity)}</p>
      </div>
    </div>
  );
}
