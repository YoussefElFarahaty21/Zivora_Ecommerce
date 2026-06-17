import { db } from '../config/firebase';

export interface OverviewStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface OrderStatusData {
  pending: number;
  shipped: number;
  delivered: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  imageUrl: string;
  totalOrders: number;
}

export const getOverview = async (): Promise<OverviewStats> => {
  try {
    console.log('[AnalyticsService] Fetching overview stats...');

    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
      db.collection('users').get(),
    ]);

    let totalRevenue = 0;
    ordersSnap.docs.forEach((doc) => {
      const data = doc.data();
      totalRevenue += data.total || 0;
    });

    const stats: OverviewStats = {
      totalRevenue,
      totalOrders: ordersSnap.size,
      totalProducts: productsSnap.size,
      totalUsers: usersSnap.size,
    };

    console.log(`[AnalyticsService] ✅ Overview stats fetched: ${JSON.stringify(stats)}`);
    return stats;
  } catch (error) {
    console.error('[AnalyticsService] ❌ Error fetching overview stats:', error);
    throw error;
  }
};

export const getRevenueLast30Days = async (): Promise<RevenueDataPoint[]> => {
  try {
    console.log('[AnalyticsService] Fetching revenue for last 30 days...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    const snapshot = await db
      .collection('orders')
      .where('createdAt', '>=', thirtyDaysAgoISO)
      .get();

    const revenueMap: Record<string, number> = {};

    // Pre-fill all dates with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      revenueMap[dateStr] = 0;
    }

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const dateStr = data.createdAt?.split('T')[0];
      if (dateStr && revenueMap[dateStr] !== undefined) {
        revenueMap[dateStr] += data.total || 0;
      }
    });

    const result: RevenueDataPoint[] = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    console.log(`[AnalyticsService] ✅ Revenue data fetched for ${result.length} days`);
    return result;
  } catch (error) {
    console.error('[AnalyticsService] ❌ Error fetching revenue data:', error);
    throw error;
  }
};

export const getOrdersByStatus = async (): Promise<OrderStatusData> => {
  try {
    console.log('[AnalyticsService] Fetching orders by status...');

    const snapshot = await db.collection('orders').get();

    const statusData: OrderStatusData = {
      pending: 0,
      shipped: 0,
      delivered: 0,
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const status = data.status as keyof OrderStatusData;
      if (statusData[status] !== undefined) {
        statusData[status]++;
      }
    });

    console.log(`[AnalyticsService] ✅ Orders by status: ${JSON.stringify(statusData)}`);
    return statusData;
  } catch (error) {
    console.error('[AnalyticsService] ❌ Error fetching orders by status:', error);
    throw error;
  }
};

export const getTopProducts = async (limit = 5): Promise<TopProduct[]> => {
  try {
    console.log(`[AnalyticsService] Fetching top ${limit} products...`);

    const snapshot = await db.collection('orders').get();

    const productMap: Record<string, { name: string; imageUrl: string; count: number }> = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const items = data.items || [];
      items.forEach((item: any) => {
        if (productMap[item.productId]) {
          productMap[item.productId].count += item.quantity || 1;
        } else {
          productMap[item.productId] = {
            name: item.name,
            imageUrl: item.imageUrl,
            count: item.quantity || 1,
          };
        }
      });
    });

    const topProducts: TopProduct[] = Object.entries(productMap)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        imageUrl: data.imageUrl,
        totalOrders: data.count,
      }))
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, limit);

    console.log(`[AnalyticsService] ✅ Top ${topProducts.length} products fetched`);
    return topProducts;
  } catch (error) {
    console.error('[AnalyticsService] ❌ Error fetching top products:', error);
    throw error;
  }
};
