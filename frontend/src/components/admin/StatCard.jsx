import { formatCurrency } from '../../utils/formatCurrency';

export default function StatCard({ title, value, icon, color = 'blue', isCurrency = false }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const displayValue = isCurrency
    ? formatCurrency(value || 0)
    : (value || 0).toLocaleString();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5 truncate">{displayValue}</p>
      </div>
    </div>
  );
}
