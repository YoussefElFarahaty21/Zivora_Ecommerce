import { Request, Response } from 'express';
import {
  getOverview,
  getRevenueLast30Days,
  getOrdersByStatus,
  getTopProducts,
} from '../services/analyticsService';

export const getOverviewStats = async (req: Request, res: Response) => {
  try {
    console.log('[AnalyticsController] GET /api/analytics/overview called');
    const stats = await getOverview();
    res.status(200).json({
      success: true,
      data: stats,
      message: 'Overview stats fetched successfully',
    });
  } catch (error) {
    console.error('[AnalyticsController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview stats',
      message: 'An unexpected error occurred',
    });
  }
};

export const getRevenueData = async (req: Request, res: Response) => {
  try {
    console.log('[AnalyticsController] GET /api/analytics/revenue called');
    const data = await getRevenueLast30Days();
    res.status(200).json({
      success: true,
      data,
      message: 'Revenue data fetched successfully',
    });
  } catch (error) {
    console.error('[AnalyticsController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue data',
      message: 'An unexpected error occurred',
    });
  }
};

export const getOrdersStatusData = async (req: Request, res: Response) => {
  try {
    console.log('[AnalyticsController] GET /api/analytics/orders called');
    const data = await getOrdersByStatus();
    res.status(200).json({
      success: true,
      data,
      message: 'Orders status data fetched successfully',
    });
  } catch (error) {
    console.error('[AnalyticsController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders status data',
      message: 'An unexpected error occurred',
    });
  }
};

export const getTopProductsData = async (req: Request, res: Response) => {
  try {
    console.log('[AnalyticsController] GET /api/analytics/top-products called');
    const data = await getTopProducts(5);
    res.status(200).json({
      success: true,
      data,
      message: 'Top products data fetched successfully',
    });
  } catch (error) {
    console.error('[AnalyticsController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top products data',
      message: 'An unexpected error occurred',
    });
  }
};
