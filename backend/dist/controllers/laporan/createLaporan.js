"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createLaporan;
const client_1 = require("@prisma/client");
const ticket_1 = require("../../utils/ticket");
const supabase_1 = require("../../utils/supabase");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
async function createLaporan(req, res) {
    try {
        const { nama, noHp, komoditas, namaToko, alamat, kecamatan, kronologi } = req.body;
        if (!nama || !noHp || !komoditas || !alamat || !kecamatan || !kronologi) {
            res.status(400).json({ success: false, message: 'Semua field wajib harus diisi' });
            return;
        }
        const tiket = await (0, ticket_1.generateTiket)();
        const files = req.files;
        let fotoBuktiUrl = null;
        let fotoBukti2Url = null;
        if (files && files['fotoBukti'] && files['fotoBukti'][0]) {
            const file = files['fotoBukti'][0];
            const fileName = `bukti-${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
            const { error } = await supabase_1.supabase.storage
                .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ success: false, message: 'Gagal mengupload foto bukti.' });
                return;
            }
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
                .getPublicUrl(fileName);
            fotoBuktiUrl = publicUrl;
        }
        if (files && files['fotoBukti2'] && files['fotoBukti2'][0]) {
            const file2 = files['fotoBukti2'][0];
            const fileName2 = `bukti2-${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file2.originalname)}`;
            const { error } = await supabase_1.supabase.storage
                .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
                .upload(fileName2, file2.buffer, {
                contentType: file2.mimetype,
                upsert: true,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ success: false, message: 'Gagal mengupload foto bukti 2.' });
                return;
            }
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from(process.env.SUPABASE_BUCKET_LAPORAN || 'foto_laporan')
                .getPublicUrl(fileName2);
            fotoBukti2Url = publicUrl;
        }
        const laporan = await prisma.laporan.create({
            data: {
                tiket, nama, noHp, komoditas,
                namaToko: namaToko || null,
                alamat, kecamatan, kronologi,
                fotoBukti: fotoBuktiUrl,
                fotoBukti2: fotoBukti2Url,
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