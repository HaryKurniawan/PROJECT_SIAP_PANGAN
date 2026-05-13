import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Search, Package, Wheat, Droplets, Leaf, Clock } from 'lucide-react-native';
import { useHarga } from '../../hooks/api';

const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: Package },
  { id: 'Kebutuhan Pokok', label: 'Kebutuhan Pokok', icon: Wheat },
  { id: 'Barang Penting', label: 'Barang Penting', icon: Droplets },
  { id: 'Lain - lain', label: 'Lain - lain', icon: Leaf },
];

export default function HargaScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const { data, isLoading } = useHarga({ search });

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(value);

  const hargaList = useMemo(() => {
    let list = data?.data || [];
    if (activeCategory !== 'semua') {
      list = list.filter((item: any) => {
        return item.kategori === activeCategory || (activeCategory === 'Kebutuhan Pokok' && !item.kategori);
      });
    }
    return list;
  }, [data, activeCategory]);

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 flex-1 pt-4">
        <View className="flex-row gap-2 mt-2">
          <View className="flex-1 bg-gray-50/50 border border-gray-200 rounded-2xl flex-row items-center px-4">
            <Search size={18} color="#94a3b8" strokeWidth={2} />
            <TextInput
              placeholder="Cari komoditas..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-3 py-3.5 text-[14px] font-medium text-gray-900"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Category Pills */}
        <View className="mt-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 -mx-5 px-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 999,
                    borderWidth: 1,
                    marginRight: 8,
                    backgroundColor: isActive ? '#2563eb' : '#ffffff',
                    borderColor: isActive ? 'transparent' : '#e2e8f0',
                  }}
                >
                  <Icon size={14} color={isActive ? 'white' : '#9CA3AF'} strokeWidth={2.5} />
                  <Text className={`text-[12px] font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Harga List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {isLoading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#3a5dcf" size="large" />
              <Text className="text-[12px] font-medium text-gray-400 mt-2">Memuat data harga...</Text>
            </View>
          ) : hargaList.length === 0 ? (
            <View className="py-12 bg-white rounded-[24px] border border-gray-100 items-center justify-center shadow-sm">
              <Package size={40} color="#E5E7EB" strokeWidth={1.5} className="mb-3" />
              <Text className="text-[14px] font-bold text-gray-700">Tidak ditemukan</Text>
              <Text className="text-[12px] text-gray-400 font-medium mt-1">Coba kata kunci lain</Text>
            </View>
          ) : (
            <View className="flex flex-col gap-3 pb-10">
              {hargaList.map((item: any) => {
                const isNormal = item.status === 'normal';
                const isBeras = item.nama.toLowerCase().includes('beras');
                const isMinyak = item.nama.toLowerCase().includes('minyak');

                return (
                  <View
                    key={item.id}
                    className="bg-white rounded-[20px] p-4 border border-gray-200"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3.5">
                        <View className={`w-11 h-11 rounded-[14px] items-center justify-center border
                          ${isBeras ? 'bg-emerald-50 border-emerald-100/50' :
                            isMinyak ? 'bg-amber-50 border-amber-100/50' :
                            'bg-blue-50 border-blue-100/50'
                          }`}
                        >
                          {isBeras ? <Wheat size={20} color="#059669" strokeWidth={2} /> :
                           isMinyak ? <Droplets size={20} color="#f59e0b" strokeWidth={2} /> :
                           <Package size={20} color="#3b82f6" strokeWidth={2} />}
                        </View>
                        <View>
                          <Text className="text-[14px] font-bold text-gray-900 leading-tight">{item.nama}</Text>
                          <View className={`mt-1.5 px-2 py-0.5 rounded-full self-start
                            ${isNormal ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                            <Text className={`text-[9px] font-bold uppercase tracking-wider
                              ${isNormal ? 'text-emerald-600' : 'text-orange-600'}`}>
                              {isNormal ? '✓ HET Stabil' : '⚠ Awasi'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="items-end">
                        <View className="flex-row items-baseline gap-0.5">
                          <Text className="text-[11px] font-bold text-gray-400">Rp</Text>
                          <Text className="text-[20px] font-bold tracking-tight text-gray-900 leading-none">
                            {new Intl.NumberFormat('id-ID').format(item.harga)}
                          </Text>
                        </View>
                        <Text className="text-[11px] font-medium text-gray-400">/{item.satuan}</Text>
                      </View>
                    </View>

                    {item.updatedAt && (
                      <View className="mt-3 pt-3 border-t border-gray-50 flex-row items-center gap-1.5">
                        <Clock size={12} color="#D1D5DB" strokeWidth={2.5} />
                        <Text className="text-[10px] text-gray-400 font-medium">
                          Update {new Date(item.updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
