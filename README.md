#  SIAP PANGAN Brebes

**Sistem Informasi Aman Pangan Kabupaten Brebes**
Pelaporan masyarakat, pemantauan harga pangan, dan edukasi keamanan pangan, dalam satu platform web dan mobile.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)

</div>

---

## Tentang Proyek

**SIAP PANGAN Brebes** adalah platform layanan publik untuk menjaga stabilitas dan keamanan pangan di Kabupaten Brebes. Masyarakat dapat melaporkan dugaan pelanggaran pangan (harga tidak wajar, barang berbahaya, dan sejenisnya), memantau harga komoditas, melacak progres laporan lewat nomor tiket, serta membaca materi edukasi. Petugas mengelola semuanya lewat dashboard admin.

Proyek ini berbentuk **monorepo** berisi tiga aplikasi yang berbagi satu REST API:

| Folder | Aplikasi | Teknologi utama |
|---|---|---|
| [`backend/`](backend) | REST API | Express, Prisma, PostgreSQL, Supabase Storage |
| [`frontend/`](frontend) | Web publik + dashboard admin | Next.js 14 (App Router), Tailwind CSS, TanStack Query |
| [`mobile/`](mobile) | Aplikasi Android/iOS untuk masyarakat | Expo SDK 54, Expo Router, NativeWind |

##  Fitur

### Untuk masyarakat (web & mobile)
- **Lapor** — kirim laporan dengan identitas pelapor, komoditas, lokasi (kecamatan), kronologi, dan hingga **2 foto bukti** (JPG/PNG/WebP, maks. 5 MB per file). Sistem menghasilkan **nomor tiket** berformat `SPB-YYYY-NNNN`.
- **Cek Laporan** — lacak status dan riwayat laporan lewat nomor tiket. Riwayat tiket tersimpan di perangkat pelapor karena tidak ada login pengguna.
- **Harga Pangan** — daftar harga komoditas dengan pencarian dan filter kategori/status (`normal` / `tinggi`).
- **Pantau via QR** — setiap komoditas punya halaman publik `/pantau/[id]` yang bisa dibuka dengan memindai QR code.
- **Edukasi** — artikel keamanan pangan untuk konsumen.

### Untuk admin / petugas (web)
- **Login** aman dengan JWT di HttpOnly cookie.
- **Dashboard statistik** — total laporan, jumlah per status, laporan terbaru, serta 10 teratas per kecamatan dan per komoditas.
- **Kelola laporan** — ubah status, beri catatan petugas, unggah keterangan dan foto tindak lanjut, hapus laporan.
- **Kelola harga & artikel** — CRUD penuh.
- **QR Generator** — buat dan cetak QR code per komoditas.

### Status laporan

Lima status yang valid: `diterima`, `diverifikasi`, `diproses`, `selesai`, `ditolak`. Urutan yang lazim:

```mermaid
flowchart LR
    A[diterima] --> B[diverifikasi] --> C[diproses] --> D[selesai]
    A -.-> E[ditolak]
    B -.-> E
```

Sistem tidak memaksakan urutan transisi, petugas bebas memilih status apa pun. Setiap perubahan dicatat di tabel `status_logs` sehingga pelapor dapat melihat riwayat lengkapnya.

##  Arsitektur

```mermaid
flowchart TB
    Web["Web (Next.js)<br/>:3000"] -->|"x-api-key + cookie JWT"| API
    Mobile["Mobile (Expo)"] -->|"x-api-key"| API
    API["REST API (Express)<br/>:5000"] --> DB[("PostgreSQL<br/>via Prisma")]
    API --> Storage[("Supabase Storage<br/>foto laporan & tindak lanjut")]
```

### Struktur folder

```
PROJECT_SIAP_PANGAN/
├── backend/
│   ├── prisma/            # schema.prisma + seed.ts
│   └── src/
│       ├── controllers/   # admin, artikel, harga, laporan
│       ├── middleware/    # apiKey.ts, auth.ts (JWT cookie)
│       ├── routes/        # definisi endpoint
│       ├── utils/         # supabase client, generator tiket
│       └── index.ts       # entry point Express
├── frontend/
│   ├── app/               # halaman publik & /admin/*
│   ├── components/        # Header, BottomNav, komponen UI (shadcn)
│   └── lib/               # api client, hooks, skema Zod, ticket-storage
├── mobile/
│   ├── app/               # Expo Router: (tabs), edukasi/[id], pantau/[id]
│   ├── components/ hooks/ constants/ lib/
│   └── eas.json           # profil build EAS
├── scripts/commit.js      # helper commit konvensional
└── .husky/                # pre-commit (lint) & pre-push (build)
```

##  Memulai

### Prasyarat

- **Node.js 20 LTS** atau lebih baru (disarankan) dan npm
- Database **PostgreSQL**. Proyek ini dikonfigurasi untuk [Supabase](https://supabase.com)
- Dua bucket **Supabase Storage**: satu untuk foto laporan (default `foto_laporan`) dan satu bernama `foto_tindaklanjut`
- Untuk mobile: aplikasi **Expo Go** atau emulator Android/iOS

### 1. Clone & instal dependensi

```bash
git clone https://github.com/HaryKurniawan/PROJECT_SIAP_PANGAN.git
cd PROJECT_SIAP_PANGAN

npm install                    # root: concurrently, husky, lint-staged
npm install --prefix backend
npm install --prefix frontend
npm install --prefix mobile    # opsional, hanya jika memakai aplikasi mobile
```

### 2. Konfigurasi environment

Buat file `.env` di tiap folder. **Jangan pernah meng-commit file `.env`**, dan isi semua nilai di bawah dengan milik Anda sendiri.

<details open>
<summary><b>backend/.env</b></summary>

```env
# Database (Supabase: pooled connection untuk runtime, direct untuk migrasi)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Keamanan: gunakan string acak yang panjang dan unik
JWT_SECRET="ganti-dengan-secret-acak"
COOKIE_SECRET="ganti-dengan-secret-acak"
API_KEY="ganti-dengan-api-key-acak"

# Supabase Storage
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
SUPABASE_BUCKET_LAPORAN="foto_laporan"

PORT=5000
```
</details>

<details open>
<summary><b>frontend/.env.local</b></summary>

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_API_KEY="nilai yang sama dengan API_KEY backend"
```
</details>

<details open>
<summary><b>mobile/.env</b></summary>

```env
# Emulator Android: gunakan 10.0.2.2. Perangkat fisik: gunakan IP LAN komputer Anda
EXPO_PUBLIC_API_URL="http://192.168.x.x:5000/api"
EXPO_PUBLIC_API_KEY="nilai yang sama dengan API_KEY backend"
```
</details>

> **Catatan:** `API_KEY` dikirim lewat header `x-api-key` dari aplikasi klien, jadi fungsinya sebagai pembatas akses dasar, bukan rahasia sejati. Perlindungan data admin sesungguhnya ada pada autentikasi JWT.

### 3. Siapkan database

```bash
cd backend
npm run db:migrate   # membuat tabel (menjalankan prisma migrate dev)
npm run db:seed      # akun admin awal, 15 data harga, dan 4 artikel contoh
```

Seed membuat satu akun admin awal (lihat [`backend/prisma/seed.ts`](backend/prisma/seed.ts)). **Segera ganti kata sandinya** sebelum aplikasi diakses publik.

### 4. Jalankan

Dari root repositori:

```bash
npm run dev            # backend (:5000) + frontend (:3000) sekaligus
npm run dev:backend    # hanya backend
npm run dev:frontend   # hanya frontend
npm run dev:mobile     # Expo dev server (dengan cache dibersihkan)
```

| Layanan | URL |
|---|---|
| Web publik | http://localhost:3000 |
| Dashboard admin | http://localhost:3000/admin/login |
| API | http://localhost:5000/api |
| Health check | http://localhost:5000/health |

##  Referensi API

Semua endpoint di bawah `/api` wajib menyertakan header `x-api-key`. Endpoint admin juga membutuhkan cookie `admin_token` (didapat dari login, berlaku 24 jam).

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/laporan` | Publik | Kirim laporan (`multipart/form-data`; file `fotoBukti`, `fotoBukti2`) |
| `GET` | `/api/laporan/tiket/:tiket` | Publik | Status & riwayat laporan berdasarkan tiket |
| `GET` | `/api/laporan` | Admin | Daftar semua laporan |
| `GET` | `/api/laporan/:id` | Admin | Detail laporan |
| `PATCH` | `/api/laporan/:id/status` | Admin | Ubah status (`multipart`; opsional `tindakLanjutFoto`) |
| `DELETE` | `/api/laporan/:id` | Admin | Hapus laporan |
| `GET` | `/api/harga` | Publik | Daftar harga, query: `search`, `kategori`, `status` |
| `POST` `PUT` `DELETE` | `/api/harga[/:id]` | Admin | Kelola harga |
| `GET` | `/api/artikel` · `/api/artikel/:id` | Publik | Artikel edukasi |
| `POST` `PUT` `DELETE` | `/api/artikel[/:id]` | Admin | Kelola artikel |
| `POST` | `/api/admin/login` | Publik | Login admin (dibatasi 20 percobaan / 15 menit) |
| `POST` | `/api/admin/logout` | Admin | Logout |
| `GET` | `/api/admin/me` | Admin | Profil admin aktif |
| `GET` | `/api/admin/stats` | Admin | Statistik dashboard |

Seluruh respons berformat `{ "success": boolean, "message"?: string, "data"?: ... }`. Rate limit global: 1000 request per 15 menit per IP.

**Contoh: cek status laporan**

```bash
curl -H "x-api-key: <API_KEY>" http://localhost:5000/api/laporan/tiket/SPB-2026-0001
```

##  Model Data

| Model | Fungsi | Field utama |
|---|---|---|
| `Admin` | Akun petugas | `username` (unik), `password` (bcrypt), `nama` |
| `Laporan` | Laporan masyarakat | `tiket` (unik), `nama`, `noHp`, `komoditas`, `namaToko?`, `alamat`, `kecamatan`, `kronologi`, `fotoBukti`, `fotoBukti2`, `status`, `catatanPetugas`, `tindakLanjutKeterangan`, `tindakLanjutFoto` |
| `StatusLog` | Riwayat perubahan status (cascade delete dari `Laporan`) | `laporanId`, `status`, `catatan` |
| `HargaPangan` | Harga komoditas | `nama`, `kategori`, `harga`, `satuan`, `status` |
| `Artikel` | Materi edukasi | `judul`, `isi`, `ikon`, `warna` |

Skema lengkap: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma). Lihat data lewat GUI dengan `npm run db:studio` (di folder `backend`).

##  Perintah Berguna

| Lokasi | Perintah | Fungsi |
|---|---|---|
| `backend/` | `npm run build` / `npm start` | Kompilasi TypeScript ke `dist/` lalu jalankan |
| `backend/` | `npm run db:studio` | Prisma Studio |
| `frontend/` | `npm run build` / `npm start` | Build & jalankan Next.js production |
| `frontend/` | `npm run lint` | Lint Next.js |
| `mobile/` | `npm run android` / `npm run ios` | Build & jalankan di emulator |
| root | `npm run commit` | Wizard commit berformat konvensional (`feat`, `fix`, dst.) |

### Git hooks (Husky)

- **pre-commit** — menjalankan ESLint (`lint-staged`) pada berkas yang diubah.
- **pre-push** — membangun backend dan frontend; push dibatalkan jika build gagal.

## Deployment

- **Backend** — `npm run build` lalu `npm start` di host Node.js. Atur semua variabel env di atas, dan set `NODE_ENV=production` agar cookie login memakai flag `secure`.
- **CORS** — daftar origin yang diizinkan ada di [`backend/src/index.ts`](backend/src/index.ts) (saat ini `localhost` dan jaringan lokal). **Tambahkan domain frontend production Anda** di sana, jika tidak browser akan memblokir request.
- **Frontend** — siap di-deploy ke Vercel atau VPS (`npm run build && npm start`). Set `NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_API_KEY`.
- **Mobile** — build lewat [EAS](https://docs.expo.dev/build/introduction/) dengan profil `development`, `preview` (APK), dan `production` di [`mobile/eas.json`](mobile/eas.json). Simpan nilai `EXPO_PUBLIC_*` sebagai EAS environment variable, bukan di berkas yang ter-commit.

```bash
cd mobile
npx eas build --profile preview --platform android
```

## Kontribusi

1. Buat branch dari `main`: `git checkout -b feat/nama-fitur`
2. Commit memakai `npm run commit` agar pesan konsisten
3. Pastikan `npm run build` di `backend` dan `frontend` lolos (dicek otomatis saat push)
4. Buka Pull Request

##  Pengembang

**Hary Kurniawan** — UI/UX Designer & Full Stack Developer
[harykurniawan.my.id](https://harykurniawan.my.id) ·  [@HaryKurniawan](https://github.com/HaryKurniawan)

##  Lisensi

ISC, sesuai `package.json`.
