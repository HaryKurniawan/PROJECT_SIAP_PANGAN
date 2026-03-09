import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function deleteArtikel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.artikel.delete({ where: { id: parseInt(id as string, 10) } });
    res.json({ success: true, message: 'Artikel dihapus.' });
  } catch (error) {
    console.error('Error deleting artikel:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus artikel.' });
  }
}
