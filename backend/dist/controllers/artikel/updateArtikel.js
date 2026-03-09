"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateArtikel;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function updateArtikel(req, res) {
    try {
        const { id } = req.params;
        const { judul, isi, ikon, warna } = req.body;
        const updated = await prisma.artikel.update({
            where: { id: parseInt(id) },
            data: { judul: judul || undefined, isi: isi || undefined, ikon: ikon || undefined, warna: warna || undefined },
        });
        res.json({ success: true, message: 'Artikel diperbarui.', data: updated });
    }
    catch (error) {
        console.error('Error updating artikel:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.' });
    }
}
//# sourceMappingURL=updateArtikel.js.map