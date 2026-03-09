import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getAllArtikel(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const artikels = await prisma.artikel.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: artikels });
  } catch (error) {
    console.error('Error fetching artikels:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
  }
}
