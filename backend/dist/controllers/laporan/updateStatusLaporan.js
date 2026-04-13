"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateStatusLaporan;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const VALID_STATUSES = ['diterima', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
async function updateStatusLaporan(req, res) {
    try {
        const { id } = req.params;
        const { status, catatan } = req.body;
        if (!VALID_STATUSES.includes(status)) {
            res.status(400).json({ success: false, message: `Status harus: ${VALID_STATUSES.join(', ')}` });
            return;
        }
        const laporan = await prisma.laporan.update({
            where: { id: parseInt(id, 10) },
            data: {
                status,
                catatanPetugas: catatan || undefined,
                statusLogs: { create: { status, catatan: catatan || null } },
            },
            include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
        });
        res.json({ success: true, message: `Status diubah menjadi "${status}"`, data: laporan });
    }
    catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Gagal mengubah status.' });
    }
}
//# sourceMappingURL=updateStatusLaporan.js.map