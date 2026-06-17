import { Router } from 'express';
import { getUsers, getUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUser);

export default router;
