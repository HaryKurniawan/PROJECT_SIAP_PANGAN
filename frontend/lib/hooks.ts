import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { LaporanFormData, LoginFormData, HargaFormData, ArtikelFormData } from './schemas';

// ==========================================
// PUBLIC HOOKS
// ==========================================

/** Buat laporan baru */
export function useCreateLaporan() {
  return useMutation({
    mutationFn: async (data: LaporanFormData & { fotoBukti?: File, fotoBukti2?: File }) => {
      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('noHp', data.noHp);
      formData.append('komoditas', data.komoditas);
      formData.append('alamat', data.alamat);
      formData.append('kecamatan', data.kecamatan);
      formData.append('kronologi', data.kronologi);
      if (data.namaToko) formData.append('namaToko', data.namaToko);
      if (data.fotoBukti) formData.append('fotoBukti', data.fotoBukti);
      if (data.fotoBukti2) formData.append('fotoBukti2', data.fotoBukti2);

      const res = await api.post('/laporan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
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

/** List harga pangan (publik) */
export function useHarga(search?: string) {
  return useQuery({
    queryKey: ['harga', search],
    queryFn: async () => {
      const res = await api.get('/harga', { params: { search } });
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

// ==========================================
// ADMIN HOOKS
// ==========================================

/** Admin login */
export function useAdminLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post('/admin/login', data);
      return res.data;
    },
  });
}

/** Dashboard stats */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
  });
}

/** List laporan admin (pagniated, searchable) */
export function useAdminLaporan(params?: {
  status?: string;
  kecamatan?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'laporan', params],
    queryFn: async () => {
      const res = await api.get('/laporan', { params });
      return res.data;
    },
  });
}

/** Detail laporan admin */
export function useAdminLaporanDetail(id: number) {
  return useQuery({
    queryKey: ['admin', 'laporan', id],
    queryFn: async () => {
      const res = await api.get(`/laporan/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

/** Update status laporan */
export function useUpdateStatusLaporan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, catatan, tindakLanjutKeterangan, tindakLanjutFoto }: { id: number; status: string; catatan?: string; tindakLanjutKeterangan?: string; tindakLanjutFoto?: File }) => {
      const formData = new FormData();
      formData.append('status', status);
      if (catatan) formData.append('catatan', catatan);
      if (tindakLanjutKeterangan) formData.append('tindakLanjutKeterangan', tindakLanjutKeterangan);
      if (tindakLanjutFoto) formData.append('tindakLanjutFoto', tindakLanjutFoto);

      const res = await api.patch(`/laporan/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'laporan'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

/** Hapus laporan */
export function useDeleteLaporan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/laporan/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'laporan'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

/** Tambah harga (admin) */
export function useCreateHarga() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: HargaFormData) => {
      const res = await api.post('/harga', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harga'] });
    },
  });
}

/** Edit harga (admin) */
export function useUpdateHarga() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: HargaFormData & { id: number }) => {
      const res = await api.put(`/harga/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harga'] });
    },
  });
}

/** Hapus harga (admin) */
export function useDeleteHarga() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/harga/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harga'] });
    },
  });
}

/** Tambah artikel (admin) */
export function useCreateArtikel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ArtikelFormData) => {
      const res = await api.post('/artikel', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artikel'] });
    },
  });
}

/** Edit artikel (admin) */
export function useUpdateArtikel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: ArtikelFormData & { id: number }) => {
      const res = await api.put(`/artikel/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artikel'] });
    },
  });
}

/** Hapus artikel (admin) */
export function useDeleteArtikel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/artikel/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artikel'] });
    },
  });
}
