"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllArtikel;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllArtikel(_req, res) {
    try {
        const artikels = await prisma.artikel.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: artikels });
    }
    catch (error) {
        console.error('Error fetching artikels:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
    }
}
//# sourceMappingURL=getAllArtikel.js.map