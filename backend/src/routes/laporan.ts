import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import { createLaporan, getLaporanByTiket, getAllLaporan, getLaporanById, updateStatusLaporan, deleteLaporan } from '../controllers/laporan';

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()) &&
               /jpeg|jpg|png|webp/.test(file.mimetype);
    if (!ok) {
      return cb(new Error('Hanya gambar (JPG, PNG, WebP)'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('fotoBukti'), createLaporan);
router.get('/tiket/:tiket', getLaporanByTiket);
router.get('/', authMiddleware, getAllLaporan);
router.get('/:id', authMiddleware, getLaporanById);
router.patch('/:id/status', authMiddleware, updateStatusLaporan);
router.delete('/:id', authMiddleware, deleteLaporan);

export default router;
