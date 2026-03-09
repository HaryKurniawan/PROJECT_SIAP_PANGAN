'use client';

import { useState } from 'react';
import { Modal, Select } from 'antd';
import toast from 'react-hot-toast';
import { useAdminLaporan, useUpdateStatusLaporan, useDeleteLaporan } from '@/lib/hooks';
import { STATUS_LAPORAN, KECAMATAN_BREBES } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';

export default function AdminLaporanPage() {
  const [filters, setFilters] = useState({ status: '', kecamatan: '', search: '', page: 1 });
  const [selectedLaporan, setSelectedLaporan] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [catatan, setCatatan] = useState('');

  const { data, isLoading } = useAdminLaporan(filters);
  const updateStatus = useUpdateStatusLaporan();
  const deleteLaporan = useDeleteLaporan();

  const laporanList = data?.data || [];
  const pagination = data?.pagination;

  const openDetail = (lap: any) => {
    setSelectedLaporan(lap);
    setIsDetailOpen(true);
  };

  const openUpdateStatus = (lap: any) => {
    setSelectedLaporan(lap);
    setNewStatus(lap.status);
    setCatatan('');
    setIsStatusOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedLaporan || !newStatus) return;
    try {
      await updateStatus.mutateAsync({
        id: selectedLaporan.id,
        status: newStatus,
        catatan: catatan || undefined,
      });
      toast.success('Status berhasil diperbarui');
      setIsStatusOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal update status');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Hapus Laporan',
      content: 'Yakin ingin menghapus laporan ini? Aksi ini tidak bisa dibatalkan.',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await deleteLaporan.mutateAsync(id);
          toast.success('Laporan berhasil dihapus');
        } catch {
          toast.error('Gagal menghapus laporan');
        }
      },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Laporan</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola laporan pelanggaran pangan</p>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="admin-card-body">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input
                type="search"
                placeholder="Cari tiket, nama, komoditas..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">Semua Status</option>
              {Object.entries(STATUS_LAPORAN).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              value={filters.kecamatan}
              onChange={(e) => setFilters({ ...filters, kecamatan: e.target.value, page: 1 })}
            >
              <option value="">Semua Kecamatan</option>
              {KECAMATAN_BREBES.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        {isLoading ? (
          <div className="loading-center py-12">
            <div className="spinner"></div>
            <span className="loading-text">Memuat data...</span>
          </div>
        ) : laporanList.length === 0 ? (
          <div className="empty-state py-12">
            <i className="fas fa-inbox"></i>
            <h3>Tidak ada laporan</h3>
            <p>Coba ubah filter pencarian</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Pelapor</th>
                    <th>Komoditas</th>
                    <th>Kecamatan</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanList.map((lap: any) => {
                    const statusInfo = STATUS_LAPORAN[lap.status as keyof typeof STATUS_LAPORAN];
                    return (
                      <tr key={lap.id}>
                        <td>
                          <span className="font-mono font-bold text-blue-600 text-sm">{lap.tiket}</span>
                        </td>
                        <td className="font-medium">{lap.nama}</td>
                        <td>{lap.komoditas}</td>
                        <td>{lap.kecamatan}</td>
                        <td>
                          <span className={`badge badge-${statusInfo?.color || 'blue'}`}>
                            {statusInfo?.label || lap.status}
                          </span>
                        </td>
                        <td className="text-gray-500 text-sm whitespace-nowrap">{formatDate(lap.createdAt)}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openDetail(lap)}
                              className="btn btn-sm btn-outline"
                              title="Detail"
                              style={{ padding: '6px 10px' }}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => openUpdateStatus(lap)}
                              className="btn btn-sm btn-primary"
                              title="Update Status"
                              style={{ padding: '6px 10px' }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(lap.id)}
                              className="btn btn-sm btn-danger"
                              title="Hapus"
                              style={{ padding: '6px 10px' }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Hal {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal — Ant Design */}
      <Modal
        title={<span className="font-bold">Detail Laporan</span>}
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
        width={600}
      >
        {selectedLaporan && (
          <div className="space-y-3 mt-4">
            {[
              ['Nomor Tiket', selectedLaporan.tiket],
              ['Nama Pelapor', selectedLaporan.nama],
              ['No. HP', selectedLaporan.noHp],
              ['Komoditas', selectedLaporan.komoditas],
              ['Nama Toko', selectedLaporan.namaToko || '-'],
              ['Alamat', selectedLaporan.alamat],
              ['Kecamatan', selectedLaporan.kecamatan],
              ['Kronologi', selectedLaporan.kronologi],
              ['Status', selectedLaporan.status],
              ['Catatan Petugas', selectedLaporan.catatanPetugas || '-'],
              ['Tanggal', formatDate(selectedLaporan.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">{label}</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{value}</span>
              </div>
            ))}
            {selectedLaporan.fotoBukti && (
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">Foto Bukti:</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedLaporan.fotoBukti}`}
                  alt="Bukti"
                  className="rounded-lg max-h-64 object-cover"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update Status Modal — Ant Design */}
      <Modal
        title={<span className="font-bold">Update Status Laporan</span>}
        open={isStatusOpen}
        onCancel={() => setIsStatusOpen(false)}
        onOk={handleUpdateStatus}
        confirmLoading={updateStatus.isPending}
        okText="Simpan"
        cancelText="Batal"
        width={480}
      >
        {selectedLaporan && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              Tiket: <span className="font-bold text-blue-600">{selectedLaporan.tiket}</span>
            </p>
            <div className="form-group">
              <label className="form-label">Status Baru</label>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: '100%' }}
                size="large"
                options={Object.entries(STATUS_LAPORAN).map(([key, val]) => ({
                  value: key,
                  label: val.label,
                }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Catatan Petugas</label>
              <textarea
                rows={3}
                placeholder="Tambahkan catatan (opsional)..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
