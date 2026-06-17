import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createOrder } from '../../services/orderService';
import CheckoutSteps from '../../components/customer/CheckoutSteps';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const SHIPPING_FEE = 10;

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const total = subtotal + SHIPPING_FEE;

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      const orderPayload = {
        customerName: form.fullName,
        customerEmail: form.email,
        shippingAddress: { ...form },
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
      };

      const order = await createOrder(orderPayload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout handleConfirm error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Checkout</h1>
        <CheckoutSteps currentStep={step} />

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Step 1: Shipping Info */}
          {step === 0 && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    error={errors.fullName}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Phone"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  placeholder="+1 555 000 0000"
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    error={errors.address}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <Input
                  label="City"
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  error={errors.city}
                  placeholder="New York"
                  required
                />
                <Input
                  label="Country"
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  error={errors.country}
                  placeholder="United States"
                  required
                />
              </div>
              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Continue to Review
              </button>
            </div>
          )}

          {/* Step 2: Order Review */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">Review Your Order</h2>

              {/* Shipping Address */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Shipping To</h3>
                <p className="text-sm text-blue-800 font-medium">{form.fullName}</p>
                <p className="text-sm text-blue-700">{form.address}, {form.city}, {form.country}</p>
                <p className="text-sm text-blue-700">{form.phone} · {form.email}</p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Items ({cartItems.length})</h3>
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/48x48?text=Img'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-50"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/48x48?text=Img'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(SHIPPING_FEE)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Spinner size="sm" className="border-white border-t-transparent" />}
                  {submitting ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
