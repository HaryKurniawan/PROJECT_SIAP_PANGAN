import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAllHarga, createHarga, updateHarga, deleteHarga } from '../controllers/harga';

const router = Router();

router.get('/', getAllHarga as any);
router.post('/', authMiddleware as any, createHarga as any);
router.put('/:id', authMiddleware as any, updateHarga as any);
router.delete('/:id', authMiddleware as any, deleteHarga as any);

export default router;
