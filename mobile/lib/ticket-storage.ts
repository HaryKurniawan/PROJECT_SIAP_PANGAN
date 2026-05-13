import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TicketData {
  tiket: string;
  komoditas: string;
  kecamatan: string;
  status: string;
  createdAt: string;
}

const STORAGE_KEY = 'siap_pangan_tickets';

export async function saveTicket(ticket: TicketData) {
  try {
    const existing = await getTickets();
    const updated = [ticket, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save ticket', e);
  }
}

export async function getTickets(): Promise<TicketData[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to get tickets', e);
    return [];
  }
}
