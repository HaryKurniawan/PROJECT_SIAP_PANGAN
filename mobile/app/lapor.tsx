import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Send, Camera, ArrowLeft, Check, Ticket, Info, Shield, ChevronDown } from 'lucide-react-native';
import { useCreateLaporan } from '../hooks/api';
import { laporanSchema, KECAMATAN_BREBES } from '../lib/schemas';
import { saveTicket } from '../lib/ticket-storage';
import { Button } from '../components/ui/Button';

export default function LaporScreen() {
  const router = useRouter();
  const createLaporan = useCreateLaporan();
  
  const [form, setForm] = useState({
    nama: '',
    noHp: '',
    komoditas: '',
    namaToko: '',
    alamat: '',
    kecamatan: '',
    kronologi: '',
  });

  const [images, setImages] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [showKecamatan, setShowKecamatan] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}_${Math.random()}.jpg`,
        type: 'image/jpeg',
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    
    // Validate with Zod
    const result = laporanSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Mohon lampirkan setidaknya satu foto bukti');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, (form as any)[key]);
      });
      
      images.forEach((img, index) => {
        formData.append('foto', img as any);
      });

      const response = await createLaporan.mutateAsync(formData);
      
      if (response.data?.tiket) {
        setSuccessTicket(response.data.tiket);
        await saveTicket({
          tiket: response.data.tiket,
          komoditas: form.komoditas,
          kecamatan: form.kecamatan,
          status: 'diterima',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal mengirim laporan');
    }
  };

  if (successTicket) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="w-20 h-20 bg-emerald-50 items-center justify-center rounded-full mb-6">
          <Check size={40} color="#059669" />
        </View>
        <Text className="text-[24px] font-bold text-gray-900 text-center">Laporan Terkirim!</Text>
        <Text className="text-[14px] text-gray-500 text-center mt-2 mb-8 font-medium">
          Simpan nomor tiket ini untuk melacak status laporan Anda.
        </Text>

        <View className="bg-white rounded-[24px] p-8 mb-8 border border-gray-200 items-center w-full">
          <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Nomor Tiket</Text>
          <Text className="text-[32px] font-bold text-blue-500 tracking-widest">{successTicket}</Text>
        </View>

        <Button className="w-full mb-3" onPress={() => router.push('/(tabs)/cek-laporan')}>
          Cek Status Laporan
        </Button>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text className="text-gray-400 font-bold py-2">Kembali ke Beranda</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-5 pt-4 pb-4 flex-row items-center bg-white border-b border-gray-100">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 items-center justify-center rounded-xl active:bg-gray-100"
        >
          <ArrowLeft size={20} color="#64748b" strokeWidth={2.5} />
        </Pressable>
        <View className="ml-4">
          <Text className="text-[16px] font-bold text-gray-900">Buat Laporan</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-blue-500 px-5 py-8">
          <Text className="text-2xl font-bold text-white">Lapor Pelanggaran</Text>
          <Text className="text-sm text-blue-50 font-medium mt-1">Mohon lengkapi formulir di bawah ini</Text>
        </View>

        <View className="px-5 -mt-6 pb-10">
          <View className="bg-white rounded-[24px] border border-gray-200 p-6 space-y-5">
            
            {/* Form Fields */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Nama Pelapor</Text>
              <TextInput
                value={form.nama}
                onChangeText={(val) => setForm({...form, nama: val})}
                placeholder="Nama lengkap Anda"
                className={`bg-gray-50 border ${errors.nama ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.nama && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.nama}</Text>}
            </View>

            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Nomor WhatsApp</Text>
              <TextInput
                value={form.noHp}
                onChangeText={(val) => setForm({...form, noHp: val})}
                placeholder="Contoh: 0812..."
                keyboardType="phone-pad"
                className={`bg-gray-50 border ${errors.noHp ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.noHp && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.noHp}</Text>}
            </View>

            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Komoditas</Text>
              <TextInput
                value={form.komoditas}
                onChangeText={(val) => setForm({...form, komoditas: val})}
                placeholder="Contoh: Beras SPHP, Minyakita"
                className={`bg-gray-50 border ${errors.komoditas ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.komoditas && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.komoditas}</Text>}
            </View>

            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Lokasi Kejadian / Nama Toko</Text>
              <TextInput
                value={form.alamat}
                onChangeText={(val) => setForm({...form, alamat: val})}
                placeholder="Alamat lengkap lokasi"
                className={`bg-gray-50 border ${errors.alamat ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.alamat && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.alamat}</Text>}
            </View>

            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Kecamatan</Text>
              <Pressable
                onPress={() => setShowKecamatan(true)}
                className={`bg-gray-50 border ${errors.kecamatan ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 flex-row justify-between items-center`}
              >
                <Text className={`text-[14px] ${form.kecamatan ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
                  {form.kecamatan || 'Pilih kecamatan...'}
                </Text>
                <ChevronDown size={18} color="#94a3b8" />
              </Pressable>
              
              <Modal
                visible={showKecamatan}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowKecamatan(false)}
              >
                <Pressable 
                  className="flex-1 bg-black/50 justify-center px-6"
                  onPress={() => setShowKecamatan(false)}
                >
                  <View className="bg-white rounded-[24px] overflow-hidden">
                    <View className="p-5 border-b border-gray-100 flex-row justify-between items-center bg-gray-50/50">
                      <Text className="text-[16px] font-bold text-gray-900">Pilih Kecamatan</Text>
                      <Pressable onPress={() => setShowKecamatan(false)}>
                        <Text className="text-gray-400 font-bold text-[18px]">×</Text>
                      </Pressable>
                    </View>
                    <ScrollView className="max-h-[400px]">
                      {KECAMATAN_BREBES.map((kec) => (
                        <Pressable
                          key={kec}
                          onPress={() => {
                            setForm({...form, kecamatan: kec});
                            setShowKecamatan(false);
                          }}
                          className={`p-5 flex-row justify-between items-center border-b border-gray-50 last:border-0 ${form.kecamatan === kec ? 'bg-blue-50' : ''}`}
                        >
                          <Text className={`text-[14px] ${form.kecamatan === kec ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}>
                            {kec}
                          </Text>
                          {form.kecamatan === kec && <Check size={16} color="#2563eb" />}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </Pressable>
              </Modal>
              {errors.kecamatan && <Text className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.kecamatan}</Text>}
            </View>

            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Kronologi Pelanggaran</Text>
              <TextInput
                value={form.kronologi}
                onChangeText={(val) => setForm({...form, kronologi: val})}
                placeholder="Jelaskan detail kejadian..."
                multiline
                numberOfLines={4}
                className={`bg-gray-50 border ${errors.kronologi ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium min-h-[100px] text-start`}
                textAlignVertical="top"
              />
              {errors.kronologi && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.kronologi}</Text>}
            </View>

            {/* Photo Upload */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-3 ml-1">Foto Bukti (Wajib)</Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={pickImage}
                  className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center active:bg-gray-100"
                >
                  <Camera size={24} color="#94a3b8" />
                  <Text className="text-[10px] text-gray-400 font-bold mt-1">Tambah Foto</Text>
                </Pressable>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                  {images.map((img, idx) => (
                    <View key={idx} className="relative">
                      <Image source={{ uri: img.uri }} className="w-24 h-24 rounded-2xl" />
                      <Pressable 
                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white"
                      >
                        <Text className="text-white text-[12px] font-bold">×</Text>
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Information */}
            <View className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex-row gap-3">
              <Info size={16} color="#d97706" />
              <View className="flex-1">
                <Text className="text-[12px] font-bold text-amber-900 mb-1">Penting</Text>
                <Text className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  Identitas Anda akan dirahasiakan. Laporan akan ditindaklanjuti oleh Satgas Pangan Polres Brebes.
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <Button 
              className="mt-6 h-14" 
              onPress={handleSubmit}
              disabled={createLaporan.isPending}
            >
              {createLaporan.isPending ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
