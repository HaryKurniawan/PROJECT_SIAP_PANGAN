import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { apiKeyMiddleware } from './middleware/apiKey';
import laporanRoutes from './routes/laporan';
import hargaRoutes from './routes/harga';
import artikelRoutes from './routes/artikel';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
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
  res.json({ status: 'ok', message: 'SIAP PANGAN BREBES API is running' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`🚀 SIAP PANGAN BREBES API running on port ${PORT}`);
});
