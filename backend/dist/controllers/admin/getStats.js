"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getStats;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getStats(_req, res) {
    try {
        const [total, diterima, diverifikasi, diproses, selesai, ditolak, laporanTerbaru] = await Promise.all([
            prisma.laporan.count(),
            prisma.laporan.count({ where: { status: 'diterima' } }),
            prisma.laporan.count({ where: { status: 'diverifikasi' } }),
            prisma.laporan.count({ where: { status: 'diproses' } }),
            prisma.laporan.count({ where: { status: 'selesai' } }),
            prisma.laporan.count({ where: { status: 'ditolak' } }),
            prisma.laporan.findMany({
                orderBy: { createdAt: 'desc' }, take: 5,
                select: { id: true, tiket: true, nama: true, komoditas: true, kecamatan: true, status: true, createdAt: true },
            }),
        ]);
        const perKecamatan = await prisma.laporan.groupBy({
            by: ['kecamatan'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10,
        });
        const perKomoditas = await prisma.laporan.groupBy({
            by: ['komoditas'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10,
        });
        res.json({
            success: true,
            data: {
                total, statusCount: { diterima, diverifikasi, diproses, selesai, ditolak }, laporanTerbaru,
                perKecamatan: perKecamatan.map((k) => ({ kecamatan: k.kecamatan, jumlah: k._count.id })),
                perKomoditas: perKomoditas.map((k) => ({ komoditas: k.komoditas, jumlah: k._count.id })),
            },
        });
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik.' });
    }
}
//# sourceMappingURL=getStats.js.map