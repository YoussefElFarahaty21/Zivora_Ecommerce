import { Router } from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrders,
  getOrder,
  changeOrderStatus,
} from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// All order routes require authentication
router.post('/', authMiddleware, placeOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, changeOrderStatus);

export default router;
