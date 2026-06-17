import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const WISHLIST_KEY = 'ecommerce_wishlist';

// Deterministic pastel color from product name
function cardColor(name = '') {
  const colors = [
    'from-blue-100 to-blue-200',
    'from-indigo-100 to-indigo-200',
    'from-purple-100 to-purple-200',
    'from-pink-100 to-pink-200',
    'from-emerald-100 to-emerald-200',
    'from-amber-100 to-amber-200',
    'from-cyan-100 to-cyan-200',
    'from-rose-100 to-rose-200',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function StarRating({ rating = 4.0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-amber-400' : star - 0.5 <= rating ? 'text-amber-300' : 'text-gray-200'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]').some((p) => p.id === product.id); }
    catch { return false; }
  });

  const staticRating = ((product.price % 1.5) + 3.5).toFixed(1);
  const bg = cardColor(product.name);

  const requireAuth = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to continue', { id: 'auth-required' });
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    action();
    return true;
  };

  const handleAddToCart = (e) => {
    requireAuth(e, () => {
      if (product.stock < 1) { toast.error('This product is out of stock'); return; }
      addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    });
  };

  const handleWishlist = (e) => {
    requireAuth(e, () => {
      try {
        const list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
        let updated;
        if (list.some((p) => p.id === product.id)) {
          updated = list.filter((p) => p.id !== product.id);
          setWishlisted(false);
          toast.success('Removed from wishlist');
        } else {
          updated = [...list, product];
          setWishlisted(true);
          toast.success('Added to wishlist');
        }
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch {}
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">

          {/* Skeleton shown while loading */}
          {!imgLoaded && !imgError && (
            <div className={`absolute inset-0 bg-gradient-to-br ${bg} animate-pulse`} />
          )}

          {/* Colored placeholder if image fails */}
          {imgError && (
            <div className={`absolute inset-0 bg-gradient-to-br ${bg} flex flex-col items-center justify-center gap-2`}>
              <span className="text-3xl opacity-60">
                {{ Electronics: '⚡', Clothing: '👕', Books: '📚', 'Home & Garden': '🏡', Sports: '🏃', Toys: '🎮', Beauty: '✨' }[product.category] || '📦'}
              </span>
              <span className="text-xs font-medium text-gray-500 px-4 text-center line-clamp-2">{product.name}</span>
            </div>
          )}

          {!imgError && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.stock < 1 && (
              <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">SOLD OUT</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">ONLY {product.stock} LEFT</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-200 ${
              wishlisted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 hover:bg-white'
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${wishlisted ? 'text-white fill-white' : 'text-gray-400'}`}
              viewBox="0 0 24 24" stroke="currentColor" fill="none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick add */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H17M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                Quick Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 flex flex-col flex-1">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-2 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={parseFloat(staticRating)} />
            <span className="text-[10px] text-gray-400">({staticRating})</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-base font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
