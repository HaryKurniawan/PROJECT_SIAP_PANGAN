"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getLaporanById;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getLaporanById(req, res) {
    try {
        const { id } = req.params;
        const laporan = await prisma.laporan.findUnique({
            where: { id: parseInt(id, 10) },
            include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
        });
        if (!laporan) {
            res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });
            return;
        }
        res.json({ success: true, data: laporan });
    }
    catch (error) {
        console.error('Error fetching laporan detail:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil detail laporan.' });
    }
}
//# sourceMappingURL=getLaporanById.js.map