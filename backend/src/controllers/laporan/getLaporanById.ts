import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getLaporanById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const laporan = await prisma.laporan.findUnique({
      where: { id: parseInt(id as string, 10) },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
    });

    if (!laporan) {
      res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({ success: true, data: laporan });
  } catch (error) {
    console.error('Error fetching laporan detail:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail laporan.' });
  }
}
