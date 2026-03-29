import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin default
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword, nama: 'Administrator' },
  });
  console.log('✅ Admin created: admin / password123');

  // Harga Pangan
  const hargaData = [
    { nama: 'Beras Premium', harga: 14000, satuan: '/kg', status: 'normal' },
    { nama: 'Beras Medium', harga: 12500, satuan: '/kg', status: 'normal' },
    { nama: 'Gula Pasir', harga: 17500, satuan: '/kg', status: 'normal' },
    { nama: 'Minyak Goreng', harga: 18000, satuan: '/liter', status: 'normal' },
    { nama: 'Tepung Terigu', harga: 12000, satuan: '/kg', status: 'normal' },
    { nama: 'Daging Sapi', harga: 135000, satuan: '/kg', status: 'normal' },
    { nama: 'Daging Ayam', harga: 36000, satuan: '/kg', status: 'normal' },
    { nama: 'Telur Ayam', harga: 28000, satuan: '/kg', status: 'normal' },
    { nama: 'Bawang Merah', harga: 40000, satuan: '/kg', status: 'tinggi' },
    { nama: 'Bawang Putih', harga: 35000, satuan: '/kg', status: 'normal' },
    { nama: 'Cabai Merah', harga: 55000, satuan: '/kg', status: 'tinggi' },
    { nama: 'Cabai Rawit', harga: 60000, satuan: '/kg', status: 'tinggi' },
    { nama: 'Kedelai', harga: 11000, satuan: '/kg', status: 'normal' },
    { nama: 'Jagung', harga: 8500, satuan: '/kg', status: 'normal' },
    { nama: 'Garam', harga: 7000, satuan: '/kg', status: 'normal' },
  ];

  for (const h of hargaData) {
    const existing = await prisma.hargaPangan.findFirst({ where: { nama: h.nama } });
    if (existing) {
      await prisma.hargaPangan.update({
        where: { id: existing.id },
        data: { harga: h.harga, status: h.status },
      });
    } else {
      await prisma.hargaPangan.create({ data: h });
    }
  }
  console.log(`✅ ${hargaData.length} harga pangan seeded`);

  // Artikel Edukasi
  const artikelData = [
    { judul: 'Cara Memilih Bahan Pangan yang Aman', isi: 'Pastikan bahan pangan yang Anda beli memiliki label yang jelas, tanggal kadaluarsa yang masih berlaku, dan disimpan pada suhu yang sesuai. Hindari membeli produk dengan kemasan rusak atau berbau tidak sedap.', ikon: 'shield-halved', warna: 'green' },
    { judul: 'Mengenal Tanda-Tanda Pangan Berbahaya', isi: 'Waspada terhadap pangan yang berubah warna, berbau menyengat, memiliki tekstur tidak normal, atau mengandung benda asing. Segera laporkan jika menemukan produk mencurigakan di pasaran.', ikon: 'exclamation-triangle', warna: 'red' },
    { judul: 'Hak Konsumen dalam Keamanan Pangan', isi: 'Sebagai konsumen, Anda berhak mendapatkan informasi yang benar tentang produk pangan, termasuk komposisi, tanggal produksi, dan tanggal kadaluarsa. Jangan ragu untuk melapor jika hak Anda dilanggar.', ikon: 'user-shield', warna: 'blue' },
    { judul: 'Tips Menyimpan Bahan Pokok di Rumah', isi: 'Simpan beras di tempat kering dan tertutup rapat. Sayuran segar sebaiknya disimpan di kulkas. Daging dan ikan harus dibekukan jika tidak langsung diolah. Pastikan dapur selalu bersih dan terhindar dari hama.', ikon: 'box-archive', warna: 'purple' },
  ];

  for (const a of artikelData) {
    const existing = await prisma.artikel.findFirst({ where: { judul: a.judul } });
    if (!existing) await prisma.artikel.create({ data: a });
  }
  console.log(`✅ ${artikelData.length} artikel seeded`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
