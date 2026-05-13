import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

/** List harga pangan (publik) */
export function useHarga(params?: { search?: string; kategori?: string; status?: string }) {
  return useQuery({
    queryKey: ['harga', params],
    queryFn: async () => {
      const res = await api.get('/harga', { params });
      return res.data;
    },
  });
}

/** List artikel edukasi (publik) */
export function useArtikel() {
  return useQuery({
    queryKey: ['artikel'],
    queryFn: async () => {
      const res = await api.get('/artikel');
      return res.data;
    },
  });
}

/** Detail artikel */
export function useArtikelDetail(id: number) {
  return useQuery({
    queryKey: ['artikel', id],
    queryFn: async () => {
      const res = await api.get(`/artikel/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

/** Cek status laporan by tiket */
export function useCekLaporan(tiket: string) {
  return useQuery({
    queryKey: ['laporan', 'tiket', tiket],
    queryFn: async () => {
      const res = await api.get(`/laporan/tiket/${tiket}`);
      return res.data;
    },
    enabled: !!tiket && tiket.length >= 5,
    retry: false,
  });
}

/** Buat laporan baru */
export function useCreateLaporan() {
  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('noHp', data.noHp);
      formData.append('komoditas', data.komoditas);
      formData.append('alamat', data.alamat);
      formData.append('kecamatan', data.kecamatan);
      formData.append('kronologi', data.kronologi);
      if (data.namaToko) formData.append('namaToko', data.namaToko);
      
      // In React Native, file objects must have uri, name, and type
      if (data.fotoBukti) {
        formData.append('fotoBukti', data.fotoBukti as any);
      }
      if (data.fotoBukti2) {
        formData.append('fotoBukti2', data.fotoBukti2 as any);
      }

      const res = await api.post('/laporan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });
}

