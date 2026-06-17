const variants = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  shipped: 'bg-blue-100 text-blue-800 border border-blue-200',
  delivered: 'bg-green-100 text-green-800 border border-green-200',
  admin: 'bg-purple-100 text-purple-800 border border-purple-200',
  customer: 'bg-gray-100 text-gray-700 border border-gray-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export default function Badge({ children, variant = 'info', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.info} ${className}`}
    >
      {children}
    </span>
  );
}
