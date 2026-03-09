import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function updateHarga(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nama, harga, satuan, status } = req.body;
    const updated = await prisma.hargaPangan.update({
      where: { id: parseInt(id as string, 10) },
      data: {
        nama: nama || undefined, harga: harga ? parseInt(harga) : undefined,
        satuan: satuan || undefined, status: status || undefined,
      },
    });
    res.json({ success: true, message: 'Harga diperbarui.', data: updated });
  } catch (error) {
    console.error('Error updating harga:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui harga.' });
  }
}
