import { Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function getAllHarga(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { search, kategori, status } = req.query as { search?: string; kategori?: string; status?: string };
    const where: Prisma.HargaPanganWhereInput = {};
    if (search) where.nama = { contains: search, mode: 'insensitive' };
    if (kategori) where.kategori = kategori;
    if (status) where.status = status;

    const hargaList = await prisma.hargaPangan.findMany({ where, orderBy: { nama: 'asc' } });
    res.json({ success: true, data: hargaList });
  } catch (error) {
    console.error('Error fetching harga:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data harga.' });
  }
}
