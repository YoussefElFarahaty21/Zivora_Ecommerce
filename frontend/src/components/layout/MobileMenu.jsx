import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, isAdmin, role, user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      onClose();
      navigate('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">ShopHub</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isAuthenticated && (
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-sm font-medium text-blue-700 capitalize">{role}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          {!isAdmin && (
            <>
              <Link to="/cart" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H17M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                Cart
              </Link>
              <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wishlist
              </Link>
              {isAuthenticated && (
                <Link to="/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Orders
                </Link>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin</p>
              </div>
              {[
                { to: '/admin/dashboard', label: 'Dashboard' },
                { to: '/admin/products', label: 'Products' },
                { to: '/admin/orders', label: 'Orders' },
                { to: '/admin/users', label: 'Users' },
              ].map((item) => (
                <Link key={item.to} to={item.to} onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium">
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 text-sm text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={onClose} className="py-2.5 text-center text-sm text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={onClose} className="py-2.5 text-center text-sm text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
