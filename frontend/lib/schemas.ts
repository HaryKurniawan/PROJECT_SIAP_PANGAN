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

// Zod schema untuk login admin
export const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Zod schema untuk harga pangan (admin)
export const hargaSchema = z.object({
  nama: z.string().min(1, 'Nama komoditas wajib diisi'),
  harga: z.number().min(1, 'Harga minimal Rp 1'),
  satuan: z.string().min(1, 'Satuan wajib diisi'),
  status: z.enum(['normal', 'tinggi']).default('normal'),
});

export type HargaFormData = z.infer<typeof hargaSchema>;

// Zod schema untuk artikel edukasi (admin)
export const artikelSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter'),
  isi: z.string().min(10, 'Isi artikel minimal 10 karakter'),
  ikon: z.string().default('book'),
  warna: z.string().default('blue'),
});

export type ArtikelFormData = z.infer<typeof artikelSchema>;

// Zod schema update status laporan (admin)
export const updateStatusSchema = z.object({
  status: z.enum(['diterima', 'diverifikasi', 'diproses', 'selesai']),
  catatan: z.string().optional(),
});

export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

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

// Status laporan
export const STATUS_LAPORAN = {
  diterima: { label: 'Diterima', color: 'blue', icon: 'inbox' },
  diverifikasi: { label: 'Diverifikasi', color: 'yellow', icon: 'search' },
  diproses: { label: 'Diproses', color: 'orange', icon: 'hourglass-half' },
  selesai: { label: 'Selesai', color: 'green', icon: 'check-circle' },
} as const;
