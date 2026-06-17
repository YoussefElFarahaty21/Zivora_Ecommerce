import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function WishlistItem({ product, onRemove }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock < 1) {
      toast.error('This product is out of stock');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
          />
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mt-0.5 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-base font-bold text-gray-900 mt-1">{formatCurrency(product.price)}</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="w-full py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="w-full py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
