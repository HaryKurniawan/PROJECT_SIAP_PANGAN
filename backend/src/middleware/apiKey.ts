import { Request, Response, NextFunction } from 'express';

/**
 * API Key middleware — validates x-api-key header
 */
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string | undefined;
  const validKey = process.env.API_KEY;

  if (!validKey) return next(); // dev mode: skip if not set

  if (!apiKey) {
    res.status(403).json({ success: false, message: 'Akses ditolak. API key tidak ditemukan.' });
    return;
  }

  if (apiKey !== validKey) {
    res.status(403).json({ success: false, message: 'Akses ditolak. API key tidak valid.' });
    return;
  }

  next();
}
