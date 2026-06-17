import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import CartItem from '../../components/customer/CartItem';
import { formatCurrency } from '../../utils/formatCurrency';

const SHIPPING_FEE = 10;

export default function Cart() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const total = subtotal + (cartItems.length > 0 ? SHIPPING_FEE : 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({cartItems.length} items)</span>
            )}
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H17M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <p className="text-gray-400 font-medium text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">Add some products to get started</p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24 space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{formatCurrency(SHIPPING_FEE)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="block w-full py-2.5 text-center text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
