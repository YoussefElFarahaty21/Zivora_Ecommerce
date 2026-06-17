import { Router } from 'express';
import {
  getOverviewStats,
  getRevenueData,
  getOrdersStatusData,
  getTopProductsData,
} from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

router.get('/overview', authMiddleware, adminMiddleware, getOverviewStats);
router.get('/revenue', authMiddleware, adminMiddleware, getRevenueData);
router.get('/orders', authMiddleware, adminMiddleware, getOrdersStatusData);
router.get('/top-products', authMiddleware, adminMiddleware, getTopProductsData);

export default router;
