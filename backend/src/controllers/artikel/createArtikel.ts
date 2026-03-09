import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function createArtikel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { judul, isi, ikon, warna } = req.body;
    if (!judul || !isi) { res.status(400).json({ success: false, message: 'Judul dan isi wajib.' }); return; }
    const artikel = await prisma.artikel.create({ data: { judul, isi, ikon: ikon || 'book', warna: warna || 'blue' } });
    res.status(201).json({ success: true, message: 'Artikel ditambahkan.', data: artikel });
  } catch (error) {
    console.error('Error creating artikel:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah artikel.' });
  }
}
