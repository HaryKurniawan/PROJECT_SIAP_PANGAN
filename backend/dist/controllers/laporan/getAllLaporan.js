"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllLaporan;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllLaporan(req, res) {
    try {
        const { status, kecamatan, search, startDate, endDate, page = '1', limit = '20' } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (kecamatan)
            where.kecamatan = kecamatan;
        if (search) {
            where.OR = [
                { tiket: { contains: search, mode: 'insensitive' } },
                { nama: { contains: search, mode: 'insensitive' } },
                { komoditas: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [laporans, total] = await Promise.all([
            prisma.laporan.findMany({
                where,
                include: { statusLogs: { orderBy: { createdAt: 'desc' }, take: 1 } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.laporan.count({ where }),
        ]);
        res.json({
            success: true,
            data: laporans,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
        });
    }
    catch (error) {
        console.error('Error listing laporans:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil daftar laporan.' });
    }
}
//# sourceMappingURL=getAllLaporan.js.map