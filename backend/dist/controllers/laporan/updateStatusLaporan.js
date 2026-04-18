"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateStatusLaporan;
const client_1 = require("@prisma/client");
const supabase_1 = require("../../utils/supabase");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const VALID_STATUSES = ['diterima', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
async function updateStatusLaporan(req, res) {
    try {
        const { id } = req.params;
        const { status, catatan, tindakLanjutKeterangan } = req.body;
        if (!VALID_STATUSES.includes(status)) {
            res.status(400).json({ success: false, message: `Status harus: ${VALID_STATUSES.join(', ')}` });
            return;
        }
        const file = req.file;
        let tindakLanjutFotoUrl = undefined;
        if (file) {
            const fileName = `tindaklanjut-${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
            const { error } = await supabase_1.supabase.storage
                .from('foto_tindaklanjut')
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ success: false, message: 'Gagal mengupload foto tindak lanjut.' });
                return;
            }
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from('foto_tindaklanjut')
                .getPublicUrl(fileName);
            tindakLanjutFotoUrl = publicUrl;
        }
        const laporan = await prisma.laporan.update({
            where: { id: parseInt(id, 10) },
            data: {
                status,
                catatanPetugas: catatan || undefined,
                tindakLanjutKeterangan: tindakLanjutKeterangan || undefined,
                tindakLanjutFoto: tindakLanjutFotoUrl,
                statusLogs: { create: { status, catatan: catatan || null } },
            },
            include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
        });
        res.json({ success: true, message: `Status diubah menjadi "${status}"`, data: laporan });
    }
    catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Gagal mengubah status.' });
    }
}
//# sourceMappingURL=updateStatusLaporan.js.map