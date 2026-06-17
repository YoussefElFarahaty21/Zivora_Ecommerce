import { useState, useEffect } from 'react';
import { auth } from '../../services/firebase';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import OrderStatusChart from '../../components/admin/OrderStatusChart';
import TopProductsChart from '../../components/admin/TopProductsChart';
import Spinner from '../../components/ui/Spinner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchWithAuth = async (url) => {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');
        const [overviewData, revenueData, orderStatusData, topProductsData] = await Promise.all([
          fetchWithAuth(`${API_BASE}/api/analytics/overview`),
          fetchWithAuth(`${API_BASE}/api/analytics/revenue`),
          fetchWithAuth(`${API_BASE}/api/analytics/orders`),
          fetchWithAuth(`${API_BASE}/api/analytics/top-products`),
        ]);
        setOverview(overviewData);
        setRevenue(revenueData);
        setOrderStatus(orderStatusData);
        setTopProducts(topProductsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Dashboard fetchAll error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={overview?.totalRevenue}
          icon="💰"
          color="green"
          isCurrency
        />
        <StatCard
          title="Total Orders"
          value={overview?.totalOrders}
          icon="🛒"
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={overview?.totalProducts}
          icon="📦"
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={overview?.totalUsers}
          icon="👥"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart data={orderStatus} />
        </div>
      </div>

      <TopProductsChart data={topProducts} />
    </div>
  );
}
