import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Info, AlertTriangle, Book, Heart, Shield, Lightbulb } from 'lucide-react-native';
import { useArtikelDetail } from '../../hooks/api';

const WARNA_MAP: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-emerald-50', text: '#059669', border: 'border-emerald-100/50' },
  blue: { bg: 'bg-blue-50', text: '#3b82f6', border: 'border-blue-100/50' },
  purple: { bg: 'bg-purple-50', text: '#7c3aed', border: 'border-purple-100/50' },
  red: { bg: 'bg-red-50', text: '#dc2626', border: 'border-red-100/50' },
  yellow: { bg: 'bg-amber-50', text: '#d97706', border: 'border-amber-100/50' },
  orange: { bg: 'bg-orange-50', text: '#ea580c', border: 'border-orange-100/50' },
};

const ICON_MAP: Record<string, any> = {
  book: Book,
  heart: Heart,
  shield: Shield,
  info: Info,
  lightbulb: Lightbulb,
};

export default function EdukasiDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading, error } = useArtikelDetail(Number(id));

  const artikel = data?.data;
  const colors = artikel ? (WARNA_MAP[artikel.warna] || WARNA_MAP.blue) : WARNA_MAP.blue;
  const IconComponent = artikel ? (ICON_MAP[artikel.ikon] || Book) : Book;

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#3b82f6" size="large" />
        <Text className="text-[12px] font-medium text-gray-400 mt-2">Memuat artikel...</Text>
      </View>
    );
  }

  if (error || !artikel) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-10">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="w-16 h-16 bg-red-50 items-center justify-center rounded-full mb-4">
          <AlertTriangle size={32} color="#EF4444" />
        </View>
        <Text className="text-[18px] font-bold text-gray-800">Artikel tidak ditemukan</Text>
        <Text className="text-[13px] text-gray-400 text-center mt-2 font-medium">Maaf, artikel yang Anda cari tidak tersedia.</Text>
        <Pressable 
          onPress={() => router.back()}
          className="mt-6 bg-blue-500 px-8 py-3 rounded-xl shadow-md active:bg-blue-600"
        >
          <Text className="text-white font-bold text-sm">Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Custom Header */}
      <View className="px-5 pt-6 pb-4 flex-row items-center bg-white border-b border-gray-100">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 items-center justify-center rounded-xl active:bg-gray-100"
        >
          <ArrowLeft size={20} color="#64748b" strokeWidth={2.5} />
        </Pressable>
        <View className="ml-4">
          <Text className="text-[15px] font-bold text-gray-900">Detail Edukasi</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Article Title Header */}
        <View className="px-5 py-6 flex-row gap-4">
          <View className={`w-14 h-14 rounded-[18px] items-center justify-center border ${colors.bg} ${colors.border}`}>
            <IconComponent size={28} color={colors.text} />
          </View>
          <View className="flex-1">
            <Text className="text-[20px] font-bold text-gray-900 leading-tight mb-2">
              {artikel.judul}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Calendar size={12} color="#94a3b8" strokeWidth={2.5} />
              <Text className="text-[11px] text-gray-400 font-medium">
                {new Date(artikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Article Body */}
        <View className="px-5 pb-10">
          <View className="bg-white rounded-[24px] p-6 border border-gray-200">
            <View>
              {artikel.isi.split('\n').map((para: string, idx: number) => (
                para ? (
                  <Text key={idx} className="text-gray-600 text-[14px] leading-[1.8] mb-4">
                    {para}
                  </Text>
                ) : <View key={idx} className="h-2" />
              ))}
            </View>

            <View className="mt-6 pt-5 border-t border-gray-50">
              <View className="bg-blue-50 rounded-2xl p-4 flex-row gap-3 items-start border border-blue-100">
                <View className="w-9 h-9 bg-blue-100 items-center justify-center rounded-full">
                  <Info size={16} color="#3b82f6" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] font-bold text-blue-800 mb-0.5">Informasi Pangan</Text>
                  <Text className="text-[11px] text-blue-600 leading-relaxed font-medium">
                    Artikel ini disediakan oleh Polres Brebes untuk meningkatkan kesadaran masyarakat tentang ketahanan pangan.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
