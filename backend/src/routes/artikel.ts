import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAllArtikel, getArtikelById, createArtikel, updateArtikel, deleteArtikel } from '../controllers/artikel';

const router = Router();

router.get('/', getAllArtikel as any);
router.get('/:id', getArtikelById as any);
router.post('/', authMiddleware as any, createArtikel as any);
router.put('/:id', authMiddleware as any, updateArtikel as any);
router.delete('/:id', authMiddleware as any, deleteArtikel as any);

export default router;
