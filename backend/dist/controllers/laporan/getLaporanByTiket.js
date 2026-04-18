"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getLaporanByTiket;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getLaporanByTiket(req, res) {
    try {
        const { tiket } = req.params;
        const laporan = await prisma.laporan.findUnique({
            where: { tiket: tiket },
            include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
        });
        if (!laporan) {
            res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });
            return;
        }
        res.json({
            success: true,
            data: {
                tiket: laporan.tiket, komoditas: laporan.komoditas, kecamatan: laporan.kecamatan,
                status: laporan.status, createdAt: laporan.createdAt, updatedAt: laporan.updatedAt,
                tindakLanjutKeterangan: laporan.tindakLanjutKeterangan,
                tindakLanjutFoto: laporan.tindakLanjutFoto,
                statusLogs: (laporan.statusLogs || []).map((log) => ({
                    status: log.status, catatan: log.catatan, createdAt: log.createdAt,
                })),
            },
        });
    }
    catch (error) {
        console.error('Error fetching laporan:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data laporan.' });
    }
}
//# sourceMappingURL=getLaporanByTiket.js.map