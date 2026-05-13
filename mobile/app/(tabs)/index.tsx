import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, ChevronRight, Wheat, Droplets, Package } from 'lucide-react-native';
import { useHarga } from '../../hooks/api';
import { Button } from '../../components/ui/Button';

export default function HomeScreen() {
  const { data, isLoading } = useHarga();
  const hargaList = data?.data?.slice(0, 10) || [];

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(value);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pb-10">
        
        {/* Hero Banner */}
        <View className="px-4 pt-5">
          <LinearGradient
            colors={['#3b82f6', '#60a5fa', '#93c5fd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[24px] p-6 relative overflow-hidden"
          >
            {/* Soft Gradient Orbs Background (Visual Approximation) */}
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
            
            <View className="relative z-10">
              <Text className="text-[22px] font-bold text-white tracking-tight mb-1">
                Stabilitas Pangan
              </Text>
              <Text className="text-[12px] text-white/80 leading-relaxed mb-6 font-medium max-w-[200px]">
                Monitoring harga pasar dan layanan pengaduan pangan terpadu di Brebes.
              </Text>
              
              <Link href="/(tabs)/cek-laporan" asChild>
                <Pressable className="bg-white/95 self-start px-6 py-3 rounded-2xl shadow-sm">
                  <Text className="text-[#2143B1] font-bold text-[13px]">Lapor Sekarang</Text>
                </Pressable>
              </Link>
            </View>
            
            <ShieldCheck 
              size={100} 
              color="rgba(255,255,255,0.06)" 
              className="absolute -right-6 -bottom-6" 
            />
          </LinearGradient>
        </View>

        {/* Cek Harga Ringkas */}
        <View className="px-5 pt-10">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-[16px] font-bold text-gray-900 tracking-tight">Cek Harga Ringkas</Text>
            <Link href="/(tabs)/harga" asChild>
              <Pressable className="flex-row items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full">
                <Text className="text-[12px] font-semibold text-[#3a5dcf]">Lihat Semua</Text>
                <ChevronRight size={14} color="#3a5dcf" strokeWidth={2.5} />
              </Pressable>
            </Link>
          </View>

          <View className="bg-white rounded-[24px] border border-gray-200 overflow-hidden">
            {isLoading ? (
              <View className="p-8 items-center justify-center">
                <ActivityIndicator color="#3a5dcf" />
                <Text className="text-[11px] text-gray-400 font-medium mt-2">Memuat data...</Text>
              </View>
            ) : hargaList.length > 0 ? (
              <View>
                {hargaList.map((item: any, index: number) => {
                  const isBeras = item.nama.toLowerCase().includes('beras');
                  const isMinyak = item.nama.toLowerCase().includes('minyak');
                  
                  return (
                    <View 
                      key={item.id} 
                      className={`flex-row items-center justify-between p-4 ${index !== 0 ? 'border-t border-gray-50' : ''}`}
                    >
                      <View className="flex-row items-center gap-3.5">
                        <View className={`w-10 h-10 rounded-[14px] items-center justify-center border
                          ${isBeras ? 'bg-emerald-50 border-emerald-100' : 
                            isMinyak ? 'bg-amber-50 border-amber-100' : 
                            'bg-blue-50 border-blue-100'}
                        `}>
                          {isBeras ? <Wheat size={20} color="#059669" strokeWidth={2} /> : 
                           isMinyak ? <Droplets size={20} color="#f59e0b" strokeWidth={2} /> : 
                           <Package size={20} color="#3b82f6" strokeWidth={2} />}
                        </View>
                        <Text className="text-[14px] font-semibold text-gray-900">{item.nama}</Text>
                      </View>
                      
                      <View className="items-end">
                        <Text className="text-[14px] font-bold text-gray-900 tracking-tight">
                          {formatRupiah(item.harga)}
                          <Text className="text-[10px] text-gray-400 font-medium ml-0.5">/{item.satuan}</Text>
                        </Text>
                        <View className={`mt-1 px-1.5 py-0.5 rounded border
                          ${item.status === 'normal' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                          <Text className={`text-[8px] font-bold uppercase tracking-wider
                            ${item.status === 'normal' ? 'text-green-600' : 'text-orange-600'}`}>
                            {item.status === 'normal' ? 'HET Stabil' : 'Awasi Harga'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="p-8 items-center justify-center">
                <Text className="text-[12px] text-gray-400 font-medium">Tidak ada data harga.</Text>
              </View>
            )}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
