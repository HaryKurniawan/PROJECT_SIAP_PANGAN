/**
 * localStorage helper untuk menyimpan riwayat tiket laporan.
 * Karena tidak ada login user, tiket disimpan di browser.
 */

const STORAGE_KEY = 'siap_pangan_tiket_history';

export interface TicketHistoryItem {
  tiket: string;
  komoditas: string;
  kecamatan: string;
  status: string;
  createdAt: string;
}

/**
 * Simpan tiket baru ke localStorage
 */
export function saveTicket(ticket: TicketHistoryItem): void {
  if (typeof window === 'undefined') return;

  const history = getTicketHistory();
  // Cegah duplikat
  const exists = history.find((t) => t.tiket === ticket.tiket);
  if (!exists) {
    history.unshift(ticket); // terbaru di atas
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

/**
 * Ambil semua riwayat tiket dari localStorage
 */
export function getTicketHistory(): TicketHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Search tiket di riwayat localStorage
 */
export function searchTicketHistory(query: string): TicketHistoryItem[] {
  const history = getTicketHistory();
  if (!query.trim()) return history;

  const q = query.toLowerCase();
  return history.filter(
    (t) =>
      t.tiket.toLowerCase().includes(q) ||
      t.komoditas.toLowerCase().includes(q) ||
      t.kecamatan.toLowerCase().includes(q)
  );
}

/**
 * Update status tiket di localStorage (saat user cek status)
 */
export function updateTicketStatus(tiket: string, status: string): void {
  if (typeof window === 'undefined') return;

  const history = getTicketHistory();
  const idx = history.findIndex((t) => t.tiket === tiket);
  if (idx !== -1) {
    history[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

/**
 * Hapus satu tiket dari riwayat
 */
export function removeTicket(tiket: string): void {
  if (typeof window === 'undefined') return;

  const history = getTicketHistory().filter((t) => t.tiket !== tiket);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Hapus semua riwayat
 */
export function clearTicketHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
