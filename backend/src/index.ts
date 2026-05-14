import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';

import { apiKeyMiddleware } from './middleware/apiKey';
import laporanRoutes from './routes/laporan';
import hargaRoutes from './routes/harga';
import artikelRoutes from './routes/artikel';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiter global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // Limit setiap IP 1000 request per 15 menit agar tidak menyulitkan
  message: {
    success: false,
    message: 'Terlalu banyak permintaan, silakan coba lagi setelah beberapa saat.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:8081',
        'http://localhost:8082'
      ];

      // Allow local network IPs (e.g., http://192.168.1.8:8081)
      const isLocalNetwork = origin.startsWith('http://192.168.') || origin.startsWith('exp://');

      if (allowedOrigins.indexOf(origin) !== -1 || isLocalNetwork) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// API Key protection
app.use('/api', apiKeyMiddleware);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/laporan', laporanRoutes);
app.use('/api/harga', hargaRoutes);
app.use('/api/artikel', artikelRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'SIAP PANGAN BREBES API is running',
  });
});

// Error handler
app.use(
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 SIAP PANGAN BREBES API running on port ${PORT}`);
});