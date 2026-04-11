import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

const VALID_STATUSES = ['diterima', 'diverifikasi', 'diproses', 'selesai', 'ditolak'] as const;

export default async function updateStatusLaporan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: `Status harus: ${VALID_STATUSES.join(', ')}` });
      return;
    }

    const laporan = await prisma.laporan.update({
      where: { id: parseInt(id as string, 10) },
      data: {
        status,
        catatanPetugas: catatan || undefined,
        statusLogs: { create: { status, catatan: catatan || null } },
      },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
    });

    res.json({ success: true, message: `Status diubah menjadi "${status}"`, data: laporan });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status.' });
  }
}
