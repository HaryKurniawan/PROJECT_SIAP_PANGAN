"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const laporan_1 = require("../controllers/laporan");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, path_1.default.join(__dirname, '..', '..', 'uploads')),
    filename: (_req, file, cb) => cb(null, `bukti-${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`),
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ok = /jpeg|jpg|png|webp/.test(path_1.default.extname(file.originalname).toLowerCase()) &&
            /jpeg|jpg|png|webp/.test(file.mimetype);
        cb(ok ? null : new Error('Hanya gambar (JPG, PNG, WebP)'), ok);
    },
});
router.post('/', upload.single('fotoBukti'), laporan_1.createLaporan);
router.get('/tiket/:tiket', laporan_1.getLaporanByTiket);
router.get('/', auth_1.authMiddleware, laporan_1.getAllLaporan);
router.get('/:id', auth_1.authMiddleware, laporan_1.getLaporanById);
router.patch('/:id/status', auth_1.authMiddleware, laporan_1.updateStatusLaporan);
router.delete('/:id', auth_1.authMiddleware, laporan_1.deleteLaporan);
exports.default = router;
//# sourceMappingURL=laporan.js.map