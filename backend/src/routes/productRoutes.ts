import { Router } from 'express';
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, addProduct);
router.put('/:id', authMiddleware, adminMiddleware, editProduct);
router.delete('/:id', authMiddleware, adminMiddleware, removeProduct);

export default router;
