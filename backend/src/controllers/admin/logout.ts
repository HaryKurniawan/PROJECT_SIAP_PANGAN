import { Response } from 'express';
import type { AuthRequest } from '../../types';

export default async function logout(_req: AuthRequest, res: Response): Promise<void> {
  res.clearCookie('admin_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  res.json({ success: true, message: 'Logout berhasil.' });
}
