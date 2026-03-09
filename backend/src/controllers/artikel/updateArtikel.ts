import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function updateArtikel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { judul, isi, ikon, warna } = req.body;
    const updated = await prisma.artikel.update({
      where: { id: parseInt(id as string, 10) },
      data: { judul: judul || undefined, isi: isi || undefined, ikon: ikon || undefined, warna: warna || undefined },
    });
    res.json({ success: true, message: 'Artikel diperbarui.', data: updated });
  } catch (error) {
    console.error('Error updating artikel:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.' });
  }
}
