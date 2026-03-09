import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import { createLaporan, getLaporanByTiket, getAllLaporan, getLaporanById, updateStatusLaporan, deleteLaporan } from '../controllers/laporan';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (_req, file, cb) => cb(null, `bukti-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

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

router.post('/', upload.single('fotoBukti'), createLaporan as any);
router.get('/tiket/:tiket', getLaporanByTiket as any);
router.get('/', authMiddleware as any, getAllLaporan as any);
router.get('/:id', authMiddleware as any, getLaporanById as any);
router.patch('/:id/status', authMiddleware as any, updateStatusLaporan as any);
router.delete('/:id', authMiddleware as any, deleteLaporan as any);

export default router;
