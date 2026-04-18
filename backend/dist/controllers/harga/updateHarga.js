"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateHarga;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function updateHarga(req, res) {
    try {
        const { id } = req.params;
        const { nama, harga, satuan, status, kategori } = req.body;
        const updated = await prisma.hargaPangan.update({
            where: { id: parseInt(id, 10) },
            data: {
                nama: nama || undefined, harga: harga ? parseInt(harga) : undefined,
                satuan: satuan || undefined, status: status || undefined, kategori: kategori || undefined,
            },
        });
        res.json({ success: true, message: 'Harga diperbarui.', data: updated });
    }
    catch (error) {
        console.error('Error updating harga:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui harga.' });
    }
}
//# sourceMappingURL=updateHarga.js.map