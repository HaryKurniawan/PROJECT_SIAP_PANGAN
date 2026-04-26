"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllHarga;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllHarga(req, res) {
    try {
        const { search, kategori, status } = req.query;
        const where = {};
        if (search)
            where.nama = { contains: search, mode: 'insensitive' };
        if (kategori)
            where.kategori = kategori;
        if (status)
            where.status = status;
        const hargaList = await prisma.hargaPangan.findMany({ where, orderBy: { nama: 'asc' } });
        res.json({ success: true, data: hargaList });
    }
    catch (error) {
        console.error('Error fetching harga:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data harga.' });
    }
}
//# sourceMappingURL=getAllHarga.js.map