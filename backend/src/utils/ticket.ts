import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate nomor tiket: SPB-YYYY-NNNN
 */
export async function generateTiket(): Promise<string> {
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
