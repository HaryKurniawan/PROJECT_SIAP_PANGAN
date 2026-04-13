"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteLaporan;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function deleteLaporan(req, res) {
    try {
        const { id } = req.params;
        await prisma.laporan.delete({ where: { id: parseInt(id, 10) } });
        res.json({ success: true, message: 'Laporan berhasil dihapus.' });
    }
    catch (error) {
        console.error('Error deleting laporan:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus laporan.' });
    }
}
//# sourceMappingURL=deleteLaporan.js.map