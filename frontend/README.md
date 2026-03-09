# SIAP PANGAN BREBES

Sistem Informasi Aman Pangan Kabupaten Brebes - Next.js Version

## Tentang Proyek

SIAP PANGAN adalah aplikasi web untuk sistem pelaporan dan monitoring keamanan pangan di Kabupaten Brebes. Aplikasi ini memungkinkan masyarakat untuk:

- Melaporkan pelanggaran terkait pangan
- Memantau harga komoditas pangan
- Melacak status laporan
- Mengakses edukasi tentang keamanan pangan

## Teknologi yang Digunakan

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Font Awesome** - Icons

## Cara Menjalankan

### Prerequisites

- Node.js 18.x atau lebih baru
- npm atau yarn

### Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd siap-pangan-brebes
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

3. Jalankan development server:
```bash
npm run dev
# atau
yarn dev
```

4. Buka browser dan akses [http://localhost:3000](http://localhost:3000)

## Build untuk Production

```bash
npm run build
npm start
```

## Struktur Proyek

```
siap-pangan-brebes/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Fitur Utama

### 1. Beranda
- Dashboard dengan statistik
- Quick access ke semua layanan
- Informasi terkini

### 2. Harga Pangan
- Daftar harga komoditas pangan
- Filter/search komoditas
- Status harga (normal/tinggi)

### 3. Cek Status Laporan
- Pencarian laporan berdasarkan nomor tiket
- Detail status laporan
- Tracking progress

### 4. Edukasi
- Tips keamanan pangan
- Panduan konsumen
- Artikel edukatif

### 5. Pelaporan
- Form pelaporan pelanggaran
- Kategori laporan lengkap
- Sistem tiket otomatis

## Catatan Penting

Aplikasi ini adalah konversi dari HTML statis ke Next.js dengan:
- ✅ UI yang sama persis dengan versi HTML
- ✅ Semua styling dipertahankan
- ✅ Semua fitur dan fungsi tetap sama
- ✅ Responsif untuk mobile dan desktop
- ✅ Client-side navigation
- ✅ TypeScript untuk type safety

## Lisensi

© 2026 Kabupaten Brebes
