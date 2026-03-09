import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getArtikelById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const artikel = await prisma.artikel.findUnique({ where: { id: parseInt(id as string, 10) } });
    if (!artikel) { res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' }); return; }
    res.json({ success: true, data: artikel });
  } catch (error) {
    console.error('Error fetching artikel:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
  }
}
