import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { login, logout, getStats, getMe } from '../controllers/admin';

const router = Router();

router.post('/login', login as any);
router.post('/logout', authMiddleware as any, logout as any);
router.get('/stats', authMiddleware as any, getStats as any);
router.get('/me', authMiddleware as any, getMe as any);

export default router;
