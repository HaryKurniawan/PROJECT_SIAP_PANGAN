# Panduan Instalasi & Deployment

## Instalasi Lokal

### 1. Persiapan Environment

Pastikan sudah terinstall:
- Node.js versi 18.x atau lebih baru ([Download](https://nodejs.org/))
- npm (terinstall otomatis dengan Node.js) atau yarn

Cek versi:
```bash
node --version
npm --version
```

### 2. Install Dependencies

Buka terminal di folder project dan jalankan:

```bash
npm install
```

Atau jika menggunakan yarn:
```bash
yarn install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Atau dengan yarn:
```bash
yarn dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### 4. Build untuk Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code ke GitHub repository
2. Kunjungi [vercel.com](https://vercel.com)
3. Import repository GitHub
4. Vercel akan otomatis detect Next.js dan deploy

### Netlify

1. Build project terlebih dahulu:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

### Manual Server (VPS/Dedicated Server)

1. Clone repository di server:
```bash
git clone <repository-url>
cd siap-pangan-brebes
```

2. Install dependencies:
```bash
npm install
```

3. Build project:
```bash
npm run build
```

4. Install PM2 untuk process management:
```bash
npm install -g pm2
```

5. Jalankan dengan PM2:
```bash
pm2 start npm --name "siap-pangan" -- start
```

6. Setup Nginx sebagai reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker

1. Buat `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build dan run:
```bash
docker build -t siap-pangan-brebes .
docker run -p 3000:3000 siap-pangan-brebes
```

## Environment Variables (Opsional)

Jika ada konfigurasi tambahan, buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Troubleshooting

### Port 3000 sudah digunakan

Ubah port dengan menambahkan di package.json:
```json
"dev": "next dev -p 3001"
```

### Error saat build

Hapus folder .next dan node_modules, lalu install ulang:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Memory limit error

Tambahkan flag Node.js:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

## Support

Jika ada masalah, silakan buat issue di repository atau hubungi tim developer.
