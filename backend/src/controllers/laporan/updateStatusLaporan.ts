import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../types';
import { supabase } from '../../utils/supabase';
import path from 'path';

const prisma = new PrismaClient();

const VALID_STATUSES = ['diterima', 'diverifikasi', 'diproses', 'selesai', 'ditolak'] as const;

export default async function updateStatusLaporan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, catatan, tindakLanjutKeterangan } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: `Status harus: ${VALID_STATUSES.join(', ')}` });
      return;
    }

    const file = req.file as Express.Multer.File | undefined;
    let tindakLanjutFotoUrl = undefined;

    if (file) {
      const fileName = `tindaklanjut-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const { error } = await supabase.storage
        .from('foto_tindaklanjut')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupload foto tindak lanjut.' });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('foto_tindaklanjut')
        .getPublicUrl(fileName);

      tindakLanjutFotoUrl = publicUrl;
    }

    const laporan = await prisma.laporan.update({
      where: { id: parseInt(id as string, 10) },
      data: {
        status,
        catatanPetugas: catatan || undefined,
        tindakLanjutKeterangan: tindakLanjutKeterangan || undefined,
        tindakLanjutFoto: tindakLanjutFotoUrl,
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
