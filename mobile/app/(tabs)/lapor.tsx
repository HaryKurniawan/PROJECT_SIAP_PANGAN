import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Check, Info, ChevronDown, ArrowLeft, Shield } from 'lucide-react-native';
import { useCreateLaporan } from '../../hooks/api';
import { laporanSchema, KECAMATAN_BREBES } from '../../lib/schemas';
import { saveTicket } from '../../lib/ticket-storage';
import { Button } from '../../components/ui/Button';

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

  const resetForm = () => {
    setSuccessTicket(null);
    setForm({
      nama: '',
      noHp: '',
      komoditas: '',
      namaToko: '',
      alamat: '',
      kecamatan: '',
      kronologi: '',
    });
    setImages([]);
    setErrors({});
  };

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
      setImages([...images, ...newImages].slice(0, 2));
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

    try {
      const payload = {
        ...form,
        fotoBukti: images[0] || null,
        fotoBukti2: images[1] || null,
      };

      const response = await createLaporan.mutateAsync(payload);
      
      if (response.success && response.data?.tiket) {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
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
        <Button 
          variant="outline" 
          className="w-full mb-3" 
          onPress={resetForm}
        >
          Lapor Lagi
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-blue-500 px-5 py-8">
          <Text className="text-2xl font-bold text-white">Lapor Pelanggaran</Text>
          <Text className="text-sm text-blue-50 font-medium mt-1">Mohon lengkapi formulir di bawah ini</Text>
        </View>

        <View className="px-5 -mt-6 pb-10">
          <View className="bg-white rounded-[24px] border border-gray-200 p-6 space-y-5">
            
            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Nama Lengkap *</Text>
              <TextInput
                value={form.nama}
                onChangeText={(val) => setForm({...form, nama: val})}
                placeholder="Masukkan nama Anda"
                className={`bg-gray-50 border ${errors.nama ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.nama && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.nama}</Text>}
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Nomor HP/WA *</Text>
              <TextInput
                value={form.noHp}
                onChangeText={(val) => setForm({...form, noHp: val})}
                placeholder="08xx-xxxx-xxxx"
                keyboardType="phone-pad"
                className={`bg-gray-50 border ${errors.noHp ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.noHp && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.noHp}</Text>}
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Komoditas *</Text>
              <TextInput
                value={form.komoditas}
                onChangeText={(val) => setForm({...form, komoditas: val})}
                placeholder="Beras, Minyak, dll"
                className={`bg-gray-50 border ${errors.komoditas ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium`}
              />
              {errors.komoditas && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.komoditas}</Text>}
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Nama Toko / Distributor (Opsional)</Text>
              <TextInput
                value={form.namaToko}
                onChangeText={(val) => setForm({...form, namaToko: val})}
                placeholder="Nama tempat kejadian"
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[14px] font-medium"
              />
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Alamat Lokasi *</Text>
              <TextInput
                value={form.alamat}
                onChangeText={(val) => setForm({...form, alamat: val})}
                placeholder="Alamat detail lokasi"
                multiline
                className={`bg-gray-50 border ${errors.alamat ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium min-h-[80px]`}
                textAlignVertical="top"
              />
              {errors.alamat && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.alamat}</Text>}
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Kecamatan *</Text>
              <Pressable
                onPress={() => setShowKecamatan(true)}
                className={`bg-gray-50 border ${errors.kecamatan ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 flex-row justify-between items-center`}
              >
                <Text className={`text-[14px] ${form.kecamatan ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
                  {form.kecamatan || 'Pilih kecamatan...'}
                </Text>
                <ChevronDown size={18} color="#94a3b8" />
              </Pressable>
              
              <Modal visible={showKecamatan} transparent={true} animationType="fade">
                <Pressable className="flex-1 bg-black/50 justify-center px-6" onPress={() => setShowKecamatan(false)}>
                  <View className="bg-white rounded-[24px] overflow-hidden">
                    <View className="p-5 border-b border-gray-100 flex-row justify-between items-center">
                      <Text className="text-[16px] font-bold">Pilih Kecamatan</Text>
                      <Pressable onPress={() => setShowKecamatan(false)}>
                        <Text className="text-gray-400 font-bold">×</Text>
                      </Pressable>
                    </View>
                    <ScrollView style={{ maxHeight: 400 }}>
                      {KECAMATAN_BREBES.map((kec) => (
                        <Pressable
                          key={kec}
                          onPress={() => {
                            setForm({...form, kecamatan: kec});
                            setShowKecamatan(false);
                          }}
                          className={`p-5 border-b border-gray-50 ${form.kecamatan === kec ? 'bg-blue-50' : ''}`}
                        >
                          <Text className={`text-[14px] ${form.kecamatan === kec ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}>
                            {kec}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </Pressable>
              </Modal>
              {errors.kecamatan && <Text className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.kecamatan}</Text>}
            </View>

            {/* Field */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-2 ml-1">Kronologi Kejadian *</Text>
              <TextInput
                value={form.kronologi}
                onChangeText={(val) => setForm({...form, kronologi: val})}
                placeholder="Jelaskan detail kejadian..."
                multiline
                className={`bg-gray-50 border ${errors.kronologi ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3.5 text-[14px] font-medium min-h-[100px]`}
                textAlignVertical="top"
              />
              {errors.kronologi && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.kronologi}</Text>}
            </View>

            {/* Foto Upload */}
            <View>
              <Text className="text-[13px] font-bold text-gray-700 mb-3 ml-1">Foto Bukti (Maks. 2)</Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={pickImage}
                  className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center"
                >
                  <Camera size={24} color="#94a3b8" />
                  <Text className="text-[9px] text-gray-400 font-bold mt-1">Tambah</Text>
                </Pressable>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                  {images.map((img, idx) => (
                    <View key={idx} className="relative">
                      <Image source={{ uri: img.uri }} className="w-20 h-20 rounded-2xl" />
                      <Pressable 
                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white"
                      >
                        <Text className="text-white text-[10px] font-bold">×</Text>
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex-row gap-3">
              <Shield size={16} color="#d97706" />
              <View className="flex-1">
                <Text className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  Identitas Anda dirahasiakan. Laporan diproses maksimal 1x24 jam kerja oleh Satgas Pangan.
                </Text>
              </View>
            </View>

            <Button 
              className="mt-4 h-14" 
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
