import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getLaporanByTiket(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { tiket } = req.params;

    const laporan = await prisma.laporan.findUnique({
      where: { tiket: tiket as string },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
    });

    if (!laporan) {
      res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: {
        tiket: laporan.tiket, komoditas: laporan.komoditas, kecamatan: laporan.kecamatan,
        status: laporan.status, createdAt: laporan.createdAt, updatedAt: laporan.updatedAt,
        statusLogs: ((laporan as any).statusLogs || []).map((log: any) => ({
          status: log.status, catatan: log.catatan, createdAt: log.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching laporan:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data laporan.' });
  }
}
