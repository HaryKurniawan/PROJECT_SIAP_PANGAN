import { z } from 'zod';

// Zod schema untuk form laporan
export const laporanSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  noHp: z
    .string()
    .min(10, 'Nomor HP minimal 10 digit')
    .max(15, 'Nomor HP maksimal 15 digit')
    .regex(/^[0-9+]+$/, 'Nomor HP hanya boleh angka'),
  komoditas: z.string().min(1, 'Komoditas wajib diisi'),
  namaToko: z.string().optional(),
  alamat: z.string().min(5, 'Alamat minimal 5 karakter'),
  kecamatan: z.string().min(1, 'Kecamatan wajib dipilih'),
  kronologi: z.string().min(10, 'Kronologi minimal 10 karakter'),
});

export type LaporanFormData = z.infer<typeof laporanSchema>;

// Daftar kecamatan Kabupaten Brebes
export const KECAMATAN_BREBES = [
  'Brebes',
  'Songgom',
  'Kersana',
  'Wanasari',
  'Bulakamba',
  'Jatibarang',
  'Larangan',
  'Ketanggungan',
  'Banjarharjo',
  'Losari',
  'Tanjung',
  'Salem',
  'Bantarkawung',
  'Bumiayu',
  'Paguyangan',
  'Sirampog',
  'Tonjong',
] as const;
