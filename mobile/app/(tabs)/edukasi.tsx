import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { BookOpen, ChevronRight, Clock, Book, Heart, Shield, Info, Lightbulb } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useArtikel } from '../../hooks/api';

const WARNA_MAP: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-emerald-50', text: '#059669', border: 'border-emerald-100/50' },
  blue: { bg: 'bg-blue-50', text: '#2563eb', border: 'border-blue-100/50' },
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

export default function EdukasiScreen() {
  const router = useRouter();
  const { data, isLoading } = useArtikel();
  const artikelList = data?.data || [];

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-[18px] font-bold text-gray-900 tracking-tight">Edukasi Pangan</Text>
        <Text className="text-[12px] text-gray-400 font-medium">Pelajari tentang keamanan dan stabilitas pangan</Text>
      </View>

      <ScrollView className="flex-1 px-5 mt-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator color="#3b82f6" size="large" />
            <Text className="text-[12px] font-medium text-gray-400 mt-2">Memuat edukasi...</Text>
          </View>
        ) : artikelList.length === 0 ? (
          <View className="py-14 bg-white rounded-[20px] border border-gray-200 border-dashed items-center justify-center">
            <View className="w-14 h-14 bg-gray-50 items-center justify-center rounded-full mb-3">
              <BookOpen size={24} color="#D1D5DB" strokeWidth={1.5} />
            </View>
            <Text className="text-[14px] font-bold text-gray-700">Belum ada artikel</Text>
            <Text className="text-[12px] text-gray-400 font-medium mt-1">Arsip edukasi akan segera ditambahkan</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3 pb-10">
            {artikelList.map((artikel: any) => {
              const colors = WARNA_MAP[artikel.warna] || WARNA_MAP.blue;
              const IconComponent = ICON_MAP[artikel.ikon] || Book;

              return (
                <Pressable
                  key={artikel.id}
                  onPress={() => router.push({ pathname: '/edukasi/[id]', params: { id: artikel.id } })}
                  className="bg-white rounded-[20px] p-5 border border-gray-200 flex-row gap-4 active:bg-gray-50"
                >
                  <View className={`w-12 h-12 rounded-[14px] items-center justify-center border ${colors.bg} ${colors.border}`}>
                    <IconComponent size={24} color={colors.text} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-bold text-gray-900 mb-1 leading-tight" numberOfLines={1}>
                      {artikel.judul}
                    </Text>
                    <Text className="text-[12px] text-gray-400 leading-relaxed font-medium" numberOfLines={2}>
                      {artikel.isi}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                      {artikel.createdAt && (
                        <View className="flex-row items-center gap-1">
                          <Clock size={12} color="#D1D5DB" strokeWidth={2.5} />
                          <Text className="text-[10px] text-gray-300 font-medium">
                            {new Date(artikel.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </Text>
                        </View>
                      )}
                      <View className="flex-row items-center gap-1">
                        <Text className="text-[11px] font-bold text-blue-600">Baca</Text>
                        <ChevronRight size={12} color="#2563eb" strokeWidth={3} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
