"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getArtikelById;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getArtikelById(req, res) {
    try {
        const { id } = req.params;
        const artikel = await prisma.artikel.findUnique({ where: { id: parseInt(id, 10) } });
        if (!artikel) {
            res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
            return;
        }
        res.json({ success: true, data: artikel });
    }
    catch (error) {
        console.error('Error fetching artikel:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
    }
}
//# sourceMappingURL=getArtikelById.js.map