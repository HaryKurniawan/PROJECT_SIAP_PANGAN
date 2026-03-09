import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../types';

/**
 * JWT auth via HTTP-only cookie
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.admin_token;

  if (!token) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login terlebih dahulu.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest['admin'];
    req.admin = decoded;
    next();
  } catch {
    res.clearCookie('admin_token');
    res.status(401).json({ success: false, message: 'Sesi telah berakhir. Silakan login kembali.' });
  }
}
