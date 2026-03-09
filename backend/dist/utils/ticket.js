"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTiket = generateTiket;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Generate nomor tiket: SPB-YYYY-NNNN
 */
async function generateTiket() {
    const year = new Date().getFullYear();
    const prefix = `SPB-${year}-`;
    const lastLaporan = await prisma.laporan.findFirst({
        where: { tiket: { startsWith: prefix } },
        orderBy: { tiket: 'desc' },
    });
    let nextNum = 1;
    if (lastLaporan) {
        const lastNum = parseInt(lastLaporan.tiket.split('-')[2], 10);
        nextNum = lastNum + 1;
    }
    return `${prefix}${nextNum.toString().padStart(4, '0')}`;
}
//# sourceMappingURL=ticket.js.map