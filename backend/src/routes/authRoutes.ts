import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authMiddleware, register);
router.post('/login', authMiddleware, login);

export default router;
