import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useProduct } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const WISHLIST_KEY = 'ecommerce_wishlist';

function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${sz} transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`${sz} transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: product, isLoading: loading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  // Image gallery
  const [activeImage, setActiveImage] = useState(0);

  // Ratings
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!product) return;
    const wl = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    setWishlisted(wl.some((p) => p.id === product.id));
  }, [product]);

  useEffect(() => {
    if (!id) return;
    const fetchRatings = async () => {
      try {
        const snap = await getDocs(collection(db, 'products', id, 'ratings'));
        const data = snap.docs.map((d) => d.data());
        setRatings(data);
        if (user) {
          const userSnap = await getDoc(doc(db, 'products', id, 'ratings', user.uid));
          if (userSnap.exists()) setUserRating(userSnap.data().rating);
        }
      } catch (err) {
        console.error('Ratings fetch error:', err);
      }
    };
    fetchRatings();
  }, [id, user]);

  const avgRating =
    ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

  const handleRating = async (star) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate this product', { id: 'auth-required' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSubmittingRating(true);
    try {
      await setDoc(doc(db, 'products', id, 'ratings', user.uid), {
        rating: star,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setUserRating(star);
      setRatings((prev) => {
        const filtered = prev.filter((r) => r.userId !== user.uid);
        return [...filtered, { rating: star, userId: user.uid }];
      });
      toast.success('Rating submitted!');
    } catch (err) {
      console.error('Rating submit error:', err);
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue', { id: 'auth-required' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    action();
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      if (!product || product.stock < 1) {
        toast.error('This product is out of stock');
        return;
      }
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart`);
    });
  };

  const handleWishlist = () => {
    if (!product) return;
    requireAuth(() => {
      const wl = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      if (wishlisted) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wl.filter((p) => p.id !== product.id)));
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        wl.push(product);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wl));
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  const errorMessage = error ? 'Product not found or failed to load.' : '';

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium text-lg">{errorMessage || 'Product not found'}</p>
          <Link to="/" className="text-sm text-blue-600 hover:underline inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.imageUrl];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image Gallery */}
            <div className="flex flex-col gap-3 p-4 bg-gray-50">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100">
                <img
                  src={images[activeImage] || 'https://placehold.co/500x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-200"
                  onError={(e) => { e.target.src = 'https://placehold.co/500x500?text=No+Image'; }}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? 'border-blue-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=?'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">{product.category}</p>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                </div>

                {/* Average rating display */}
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(avgRating)} readonly size="sm" />
                  <span className="text-sm font-semibold text-gray-700">{avgRating > 0 ? avgRating : 'No ratings'}</span>
                  {ratings.length > 0 && (
                    <span className="text-xs text-gray-400">({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})</span>
                  )}
                </div>

                <p className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</p>

                <div className="flex items-center gap-2">
                  {product.stock > 10 ? (
                    <Badge variant="delivered">{product.stock} in stock</Badge>
                  ) : product.stock > 0 ? (
                    <Badge variant="pending">Only {product.stock} left</Badge>
                  ) : (
                    <Badge variant="error">Out of Stock</Badge>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                {product.stock > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium">
                        −
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-300 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium">
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock < 1}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center gap-2 px-5 py-3 border-2 rounded-xl font-medium transition-colors ${
                      wishlisted
                        ? 'border-red-300 text-red-500 bg-red-50 hover:bg-red-100'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="border-t border-gray-100 px-6 md:px-8 py-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Rate This Product</h2>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {userRating > 0 ? `Your rating: ${userRating}/5` : 'Tap a star to rate'}
                  </p>
                  <StarRating
                    value={userRating}
                    onChange={handleRating}
                    readonly={submittingRating}
                    size="md"
                  />
                </div>
                {submittingRating && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                )}
                {userRating > 0 && !submittingRating && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                    Rating saved
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-sm text-blue-700">
                  <Link to="/login" className="font-semibold underline hover:text-blue-800" state={{ from: location.pathname }}>
                    Sign in
                  </Link>{' '}
                  to rate this product and help other shoppers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
