import { Response } from 'express';
import type { AuthRequest } from '../../types';

export default async function getMe(req: AuthRequest, res: Response): Promise<void> {
  res.json({ success: true, data: req.admin });
}
