import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WishlistItem from '../../components/customer/WishlistItem';
import toast from 'react-hot-toast';

const WISHLIST_KEY = 'ecommerce_wishlist';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      setWishlist(stored ? JSON.parse(stored) : []);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
    const handleUpdate = () => loadWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const handleRemove = (productId) => {
    const updated = wishlist.filter((p) => p.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    setWishlist(updated);
    toast.success('Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Wishlist
            {wishlist.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({wishlist.length} items)</span>
            )}
          </h1>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem(WISHLIST_KEY);
                setWishlist([]);
                toast.success('Wishlist cleared');
              }}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-400 font-medium text-lg">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-1">Save items you love for later</p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((product) => (
              <WishlistItem key={product.id} product={product} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
