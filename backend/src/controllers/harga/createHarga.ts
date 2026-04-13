import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function createHarga(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { nama, harga, satuan, status, kategori } = req.body;
    if (!nama || !harga || !satuan) {
      res.status(400).json({ success: false, message: 'Field nama, harga, dan satuan wajib.' });
      return;
    }
    const newHarga = await prisma.hargaPangan.create({
      data: { nama, harga: parseInt(harga), satuan, status: status || 'normal', kategori: kategori || 'Kebutuhan Pokok' },
    });
    res.status(201).json({ success: true, message: 'Harga ditambahkan.', data: newHarga });
  } catch (error) {
    console.error('Error creating harga:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah harga.' });
  }
}
