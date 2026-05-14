import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react-native';
import api from '../../lib/api';

export default function PantauDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get('/harga');
        const allHarga = res.data?.data || [];
        const found = allHarga.find((item: any) => String(item.id) === String(id));
        setProduct(found || null);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3a5dcf" />
        <Text className="text-[13px] font-medium text-gray-400 mt-3">
          Memuat data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        className="flex-row items-center gap-2 px-5 pt-5 pb-2"
      >
        <ArrowLeft size={20} color="#6b7280" strokeWidth={2} />
        <Text className="text-[13px] font-semibold text-gray-500">Kembali</Text>
      </Pressable>

      <View className="flex-1 items-center px-6 pt-6">
        {/* Header Logo Text */}
        <View className="items-center mb-8">
          <Text className="text-[15px] font-bold text-gray-900 tracking-tight">SIAP PANGAN</Text>
          <Text className="text-[11px] font-medium text-[#3a5dcf] mt-0.5">Kabupaten Brebes</Text>
        </View>

        {/* Title */}
        <Text className="text-[22px] font-extrabold text-gray-900 text-center tracking-tight mb-6 leading-tight">
          Produk Dalam{'\n'}Pengawasan
        </Text>

        {/* Animated Checkmark */}
        <View className="relative mb-6">
          <View className="w-28 h-28 bg-emerald-50 rounded-full items-center justify-center">
            <CheckCircle size={64} color="#10b981" strokeWidth={2} />
          </View>
        </View>

        {/* Product Card */}
        {product ? (
          <View className="bg-white rounded-[20px] border border-gray-100 shadow-sm px-6 py-5 mb-4 w-full items-center">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Komoditas
            </Text>
            <Text className="text-[20px] font-bold text-gray-900 tracking-tight mb-1">
              {product.nama}
            </Text>
            <Text className="text-[16px] font-bold text-[#3a5dcf] mb-3">
              {formatRupiah(product.harga)}
              <Text className="text-[12px] text-gray-400 font-medium"> /{product.satuan}</Text>
            </Text>
            <View
              className={`px-3 py-1.5 rounded-full ${
                product.status === 'normal'
                  ? 'bg-emerald-50 border border-emerald-100'
                  : 'bg-amber-50 border border-amber-100'
              }`}
            >
              <Text
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  product.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {product.status === 'normal' ? '✓ HET Stabil' : '⚠ Awasi Harga'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-[20px] border border-gray-100 shadow-sm px-6 py-5 mb-4 w-full items-center">
            <Text className="text-[14px] font-bold text-gray-700 text-center mb-1">
              Produk Tidak Ditemukan
            </Text>
            <Text className="text-[12px] text-gray-400 font-medium text-center">
              Produk ini tidak ada dalam daftar pengawasan
            </Text>
          </View>
        )}

        {/* Description */}
        <View className="max-w-[300px] mb-8">
          <Text className="text-[13px] text-gray-500 font-medium leading-relaxed text-center">
            {product
              ? 'Produk ini telah berada dalam pengawasan harga oleh SIAP PANGAN Polres Brebes. Harga dipantau secara berkala.'
              : 'Silakan cek daftar harga untuk informasi terbaru.'}
          </Text>
        </View>

        {/* Verified Badge */}
        <View className="flex-row items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-full mb-8">
          <ShieldCheck size={16} color="#3a5dcf" strokeWidth={2.5} />
          <Text className="text-[11px] font-bold text-[#3a5dcf] uppercase tracking-wider">
            Terverifikasi SIAP PANGAN
          </Text>
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={() => router.push('/(tabs)/harga')}
          className="w-full bg-[#2143B1] rounded-[20px] py-4 flex-row items-center justify-center gap-2.5 shadow-lg"
          style={{ shadowColor: '#3a5dcf', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
        >
          <TrendingUp size={18} color="white" strokeWidth={2.5} />
          <Text className="text-white font-bold text-[14px]">Lihat Daftar Harga</Text>
          <ArrowRight size={16} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Footer */}
      <Text className="text-center text-[11px] text-gray-400 font-medium mt-8">
        © 2026 SIAP PANGAN — Polres Brebes
      </Text>
    </ScrollView>
  );
}
