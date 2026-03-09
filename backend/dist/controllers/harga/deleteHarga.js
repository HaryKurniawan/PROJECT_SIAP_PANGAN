"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteHarga;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function deleteHarga(req, res) {
    try {
        const { id } = req.params;
        await prisma.hargaPangan.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: 'Harga dihapus.' });
    }
    catch (error) {
        console.error('Error deleting harga:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus harga.' });
    }
}
//# sourceMappingURL=deleteHarga.js.map