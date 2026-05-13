import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator, Image } from 'react-native';
import { Search, Ticket, Clock, History, ChevronRight, AlertCircle, CheckCircle, Package, MapPin } from 'lucide-react-native';
import { useCekLaporan } from '../../hooks/api';
import { getTickets } from '../../lib/ticket-storage';
import { Button } from '../../components/ui/Button';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; text: string; border: string }> = {
  diterima: { label: 'Diterima', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100' },
  diverifikasi: { label: 'Diverifikasi', color: '#d97706', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  diproses: { label: 'Diproses', color: '#ea580c', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  selesai: { label: 'Selesai', color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  ditolak: { label: 'Ditolak', color: '#dc2626', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
};

export default function CekLaporanScreen() {
  const [inputTiket, setInputTiket] = useState('');
  const [searchTiket, setSearchTiket] = useState('');
  const [ticketHistory, setTicketHistory] = useState<any[]>([]);

  const { data, isLoading, isError, error } = useCekLaporan(searchTiket);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await getTickets();
    setTicketHistory(history);
  };

  const handleSearch = () => {
    if (inputTiket.trim()) {
      setSearchTiket(inputTiket.trim().toUpperCase());
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const resultStatus = data?.data?.status ? STATUS_MAP[data.data.status] : null;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-10">
        <View className="flex-row gap-2 mt-2">
          <View className="flex-1 bg-gray-50/50 border border-gray-200 rounded-2xl flex-row items-center px-4">
            <Ticket size={18} color="#94a3b8" strokeWidth={2} />
            <TextInput
              placeholder="Masukkan nomor tiket..."
              value={inputTiket}
              onChangeText={(val) => setInputTiket(val.toUpperCase())}
              className="flex-1 ml-3 py-3.5 text-[14px] font-bold text-gray-900 tracking-wide"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <Pressable 
            onPress={handleSearch}
            className="w-14 h-14 bg-blue-500 rounded-2xl items-center justify-center active:bg-blue-600 shadow-sm"
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Search size={20} color="white" strokeWidth={2.5} />}
          </Pressable>
        </View>

        {/* Error Message */}
        {isError && (
          <View className="mt-4 flex-row items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl">
            <AlertCircle size={16} color="#EF4444" />
            <Text className="text-[12px] text-red-700 font-medium flex-1">
              {(error as any)?.response?.data?.message || 'Laporan tidak ditemukan'}
            </Text>
          </View>
        )}

        {/* Search Result */}
        {data?.data && (
          <View className="mt-6 bg-white rounded-[20px] border border-gray-200 overflow-hidden">
            <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50/50">
              <Text className="text-[14px] font-bold text-gray-900">Detail Laporan</Text>
              <View className={`px-3 py-1 rounded-full border ${resultStatus?.bg || 'bg-gray-50'} ${resultStatus?.border || 'border-gray-100'}`}>
                <Text className={`text-[10px] font-bold uppercase tracking-wider ${resultStatus?.text || 'text-gray-400'}`}>
                  {resultStatus?.label || data.data.status}
                </Text>
              </View>
            </View>
            
            <View className="p-5">
              {[
                ['Nomor Tiket', data.data.tiket],
                ['Komoditas', data.data.komoditas],
                ['Kecamatan', data.data.kecamatan],
                ['Tanggal Lapor', formatDate(data.data.createdAt)],
                ['Update Terakhir', formatDate(data.data.updatedAt)],
              ].map(([label, value]) => (
                <View key={label} className="flex-row justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <Text className="text-[12px] text-gray-400 font-medium">{label}</Text>
                  <Text className={`text-[13px] font-bold text-gray-900 ${label === 'Nomor Tiket' ? 'text-blue-500 font-mono' : ''}`}>
                    {value}
                  </Text>
                </View>
              ))}

              {/* Tindak Lanjut */}
              {(data.data.tindakLanjutKeterangan || data.data.tindakLanjutFoto) && (
                <View className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <View className="flex-row items-center gap-2 mb-2">
                    <CheckCircle size={16} color="#059669" />
                    <Text className="text-[13px] font-bold text-emerald-900">Tindak Lanjut Petugas</Text>
                  </View>
                  {data.data.tindakLanjutKeterangan && (
                    <Text className="text-[12px] text-emerald-800 font-medium italic leading-relaxed mb-3">
                      "{data.data.tindakLanjutKeterangan}"
                    </Text>
                  )}
                  {data.data.tindakLanjutFoto && (
                    <Image 
                      source={{ uri: data.data.tindakLanjutFoto }} 
                      className="w-full aspect-video rounded-xl"
                      resizeMode="cover"
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* History */}
        <View className="mt-10">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-[16px] font-extrabold text-gray-900">Riwayat Tiket</Text>
              <Text className="text-[11px] font-medium text-gray-400">Tersimpan di HP ini</Text>
            </View>
            {ticketHistory.length > 0 && (
              <View className="bg-blue-50 px-2.5 py-1 rounded-full">
                <Text className="text-[11px] font-bold text-blue-500">{ticketHistory.length}</Text>
              </View>
            )}
          </View>

          {ticketHistory.length === 0 ? (
            <View className="py-12 bg-white rounded-[20px] border border-gray-200 border-dashed items-center justify-center">
              <Ticket size={32} color="#D1D5DB" strokeWidth={1.5} className="mb-2" />
              <Text className="text-[12px] text-gray-400 font-medium">Belum ada riwayat laporan</Text>
            </View>
          ) : (
            <View className="gap-3">
              {ticketHistory.map((ticket) => {
                const status = STATUS_MAP[ticket.status] || STATUS_MAP.diterima;
                return (
                  <Pressable
                    key={ticket.tiket}
                    onPress={() => {
                      setInputTiket(ticket.tiket);
                      setSearchTiket(ticket.tiket);
                    }}
                    className="bg-white rounded-2xl p-4 border border-gray-200 flex-row items-center justify-between active:bg-gray-50"
                  >
                    <View>
                      <Text className="text-[14px] font-bold text-blue-600 font-mono">{ticket.tiket}</Text>
                      <Text className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {ticket.komoditas} • {ticket.kecamatan}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className={`px-2 py-0.5 rounded-full border ${status.bg} ${status.border}`}>
                        <Text className={`text-[8px] font-bold uppercase ${status.text}`}>{status.label}</Text>
                      </View>
                      <ChevronRight size={16} color="#D1D5DB" />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
