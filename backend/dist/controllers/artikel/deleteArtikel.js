"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteArtikel;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function deleteArtikel(req, res) {
    try {
        const { id } = req.params;
        await prisma.artikel.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: 'Artikel dihapus.' });
    }
    catch (error) {
        console.error('Error deleting artikel:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus artikel.' });
    }
}
//# sourceMappingURL=deleteArtikel.js.map