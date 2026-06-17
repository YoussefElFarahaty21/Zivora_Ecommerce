import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  pending: '#f59e0b',
  shipped: '#3b82f6',
  delivered: '#10b981',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-500 capitalize mb-0.5">{payload[0].name}</p>
        <p className="text-sm font-bold text-gray-900">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

export default function OrderStatusChart({ data }) {
  const chartData = data
    ? [
        { name: 'pending', value: data.pending || 0 },
        { name: 'shipped', value: data.shipped || 0 },
        { name: 'delivered', value: data.delivered || 0 },
      ]
    : [];

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders by Status</h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
          No order data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600 capitalize">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
