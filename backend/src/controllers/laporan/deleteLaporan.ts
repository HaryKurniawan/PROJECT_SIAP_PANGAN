import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function deleteLaporan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.laporan.delete({ where: { id: parseInt(id as string, 10) } });
    res.json({ success: true, message: 'Laporan berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting laporan:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus laporan.' });
  }
}
