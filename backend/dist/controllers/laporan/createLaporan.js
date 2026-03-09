"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createLaporan;
const client_1 = require("@prisma/client");
const ticket_1 = require("../../utils/ticket");
const prisma = new client_1.PrismaClient();
async function createLaporan(req, res) {
    try {
        const { nama, noHp, komoditas, namaToko, alamat, kecamatan, kronologi } = req.body;
        if (!nama || !noHp || !komoditas || !alamat || !kecamatan || !kronologi) {
            res.status(400).json({ success: false, message: 'Semua field wajib harus diisi' });
            return;
        }
        const tiket = await (0, ticket_1.generateTiket)();
        const file = req.file;
        const laporan = await prisma.laporan.create({
            data: {
                tiket, nama, noHp, komoditas,
                namaToko: namaToko || null,
                alamat, kecamatan, kronologi,
                fotoBukti: file ? `/uploads/${file.filename}` : null,
                status: 'diterima',
                statusLogs: { create: { status: 'diterima', catatan: 'Laporan diterima oleh sistem' } },
            },
            include: { statusLogs: true },
        });
        res.status(201).json({
            success: true,
            message: 'Laporan berhasil dikirim!',
            data: { tiket: laporan.tiket, status: laporan.status, createdAt: laporan.createdAt },
        });
    }
    catch (error) {
        console.error('Error creating laporan:', error);
        res.status(500).json({ success: false, message: 'Gagal mengirim laporan.' });
    }
}
//# sourceMappingURL=createLaporan.js.map