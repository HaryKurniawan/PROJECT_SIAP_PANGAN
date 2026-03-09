"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createArtikel;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createArtikel(req, res) {
    try {
        const { judul, isi, ikon, warna } = req.body;
        if (!judul || !isi) {
            res.status(400).json({ success: false, message: 'Judul dan isi wajib.' });
            return;
        }
        const artikel = await prisma.artikel.create({ data: { judul, isi, ikon: ikon || 'book', warna: warna || 'blue' } });
        res.status(201).json({ success: true, message: 'Artikel ditambahkan.', data: artikel });
    }
    catch (error) {
        console.error('Error creating artikel:', error);
        res.status(500).json({ success: false, message: 'Gagal menambah artikel.' });
    }
}
//# sourceMappingURL=createArtikel.js.map