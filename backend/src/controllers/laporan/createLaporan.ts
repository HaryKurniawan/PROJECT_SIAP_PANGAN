import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateTiket } from '../../utils/ticket';
import type { AuthRequest } from '../../types';
import { supabase } from '../../utils/supabase';
import path from 'path';

const prisma = new PrismaClient();

export default async function createLaporan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { nama, noHp, komoditas, namaToko, alamat, kecamatan, kronologi } = req.body;

    if (!nama || !noHp || !komoditas || !alamat || !kecamatan || !kronologi) {
      res.status(400).json({ success: false, message: 'Semua field wajib harus diisi' });
      return;
    }

    const tiket = await generateTiket();
    const file = req.file as Express.Multer.File | undefined;
    let fotoBuktiUrl = null;

    if (file) {
      const fileName = `bukti-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupload foto bukti.' });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
        .getPublicUrl(fileName);

      fotoBuktiUrl = publicUrl;
    }

    const laporan = await prisma.laporan.create({
      data: {
        tiket, nama, noHp, komoditas,
        namaToko: namaToko || null,
        alamat, kecamatan, kronologi,
        fotoBukti: fotoBuktiUrl,
        status: 'diterima',
        statusLogs: { create: { status: 'diterima', catatan: 'Laporan diterima oleh sistem' } },
      },
      include: { statusLogs: true },
    });

    res.status(201).json({
      success: true,
      message: 'Laporan berhasil dikirim!',
      data: { tiket: laporan.tiket, status: laporan.status, createdAt: laporan.createdAt },
    });
  } catch (error) {
    console.error('Error creating laporan:', error);
    res.status(500).json({ success: false, message: 'Gagal mengirim laporan.' });
  }
}
