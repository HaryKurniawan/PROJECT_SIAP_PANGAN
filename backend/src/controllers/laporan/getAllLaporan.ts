import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getAllLaporan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, kecamatan, search, page = '1', limit = '20' } = req.query as Record<string, string>;

    const where: any = {};
    if (status) where.status = status;
    if (kecamatan) where.kecamatan = kecamatan;
    if (search) {
      where.OR = [
        { tiket: { contains: search, mode: 'insensitive' } },
        { nama: { contains: search, mode: 'insensitive' } },
        { komoditas: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [laporans, total] = await Promise.all([
      prisma.laporan.findMany({
        where,
        include: { statusLogs: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.laporan.count({ where }),
    ]);

    res.json({
      success: true,
      data: laporans,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('Error listing laporans:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar laporan.' });
  }
}
