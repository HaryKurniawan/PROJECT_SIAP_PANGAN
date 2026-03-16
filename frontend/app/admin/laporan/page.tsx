'use client';

import { useState } from 'react';
import { Modal, Select } from 'antd';
import toast from 'react-hot-toast';
import { useAdminLaporan, useUpdateStatusLaporan, useDeleteLaporan } from '@/lib/hooks';
import { STATUS_LAPORAN, KECAMATAN_BREBES } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Inbox,
  Clock,
  User,
  Phone,
  Store,
  FileText,
  AlertCircle
} from 'lucide-react';

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
      centered: true,
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Laporan</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola dan tindak lanjuti laporan pelanggaran pangan masyarakat</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-[#3a5dcf]" strokeWidth={2.5} />
            <h3 className="text-sm font-bold text-gray-900">Filter Pencarian</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
              <input
                type="search"
                placeholder="Cari tiket, nama, komoditas..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/30 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
            
            <div className="relative">
              <Select
                value={filters.status}
                onChange={(val) => setFilters({ ...filters, status: val, page: 1 })}
                className="w-full h-[46px] rounded-xl overflow-hidden"
                placeholder="Semua Status"
                showSearch
              >
                <Select.Option value="">Semua Status</Select.Option>
                {Object.entries(STATUS_LAPORAN).map(([key, val]) => (
                  <Select.Option key={key} value={key}>{val.label}</Select.Option>
                ))}
              </Select>
            </div>

            <div className="relative">
              <Select
                value={filters.kecamatan}
                onChange={(val) => setFilters({ ...filters, kecamatan: val, page: 1 })}
                className="w-full h-[46px] rounded-xl overflow-hidden"
                placeholder="Semua Kecamatan"
                showSearch
              >
                <Select.Option value="">Semua Kecamatan</Select.Option>
                {KECAMATAN_BREBES.map((kec) => (
                  <Select.Option key={kec} value={kec}>{kec}</Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
             <span className="text-sm font-medium text-gray-500">Memuat data laporan...</span>
          </div>
        ) : laporanList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <Inbox className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Tidak ada laporan</h3>
            <p className="text-gray-500 text-sm max-w-[280px]">Belum ada laporan yang sesuai dengan filter pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Tiket</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Pelapor</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Komoditas</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Wilayah</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Status</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {laporanList.map((lap: any) => {
                    const statusInfo = STATUS_LAPORAN[lap.status as keyof typeof STATUS_LAPORAN];
                    return (
                      <tr key={lap.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-[#3a5dcf] text-sm px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-100/50 group-hover:bg-blue-100/50 transition-colors">{lap.tiket}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm">{lap.nama}</div>
                          <div className="text-gray-400 text-[12px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {formatDate(lap.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700 text-sm">{lap.komoditas}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-medium">{lap.kecamatan}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border leading-none capitalize
                            ${statusInfo?.color === 'green' && 'bg-emerald-50 text-emerald-600 border-emerald-100'}
                            ${statusInfo?.color === 'yellow' && 'bg-amber-50 text-amber-600 border-amber-100'}
                            ${statusInfo?.color === 'orange' && 'bg-orange-50 text-orange-600 border-orange-100'}
                            ${statusInfo?.color === 'blue' && 'bg-blue-50 text-blue-600 border-blue-100'}
                            ${!statusInfo?.color && 'bg-gray-50 text-gray-600 border-gray-200'}
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse
                               ${statusInfo?.color === 'green' && 'bg-emerald-500'}
                               ${statusInfo?.color === 'yellow' && 'bg-amber-500'}
                               ${statusInfo?.color === 'orange' && 'bg-orange-500'}
                               ${statusInfo?.color === 'blue' && 'bg-blue-500'}
                               ${!statusInfo?.color && 'bg-gray-400'}
                            `}></span>
                            {statusInfo?.label || lap.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetail(lap)}
                              className="p-2 text-gray-400 hover:text-[#3a5dcf] hover:bg-blue-50 rounded-xl transition-all"
                              title="Lihat Detail"
                            >
                              <Eye className="w-5 h-5" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => openUpdateStatus(lap)}
                              className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Update Status"
                            >
                              <Edit3 className="w-5 h-5" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleDelete(lap.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-5 h-5" strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination component */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 gap-4 border-t border-gray-50">
                <span className="text-[13px] font-medium text-gray-400">
                  Menampilkan <span className="text-gray-900 font-bold">{(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari <span className="text-gray-900 font-bold">{pagination.total}</span> laporan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#3a5dcf] hover:border-[#3a5dcf]/30 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center px-4 h-10 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-900">
                    {pagination.page} / {pagination.totalPages}
                  </div>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#3a5dcf] hover:border-[#3a5dcf]/30 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal — Custom Styling */}
      <Modal
        title={
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#3a5dcf]" />
            </div>
            <span className="font-bold text-gray-900">Detail Laporan Masyarakat</span>
          </div>
        }
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
        width={720}
        centered
        className="admin-modern-modal"
      >
        {selectedLaporan && (
          <div className="mt-6 space-y-6">
            {/* Top Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[20px] border border-gray-100/50">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pelapor</p>
                    <p className="text-sm font-bold text-gray-900">{selectedLaporan.nama}</p>
                    <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {selectedLaporan.noHp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lokasi</p>
                    <p className="text-sm font-bold text-gray-900">{selectedLaporan.kecamatan}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{selectedLaporan.alamat}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Store className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Komoditas & Toko</p>
                    <p className="text-sm font-bold text-gray-900">{selectedLaporan.komoditas}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5 font-medium">{selectedLaporan.namaToko || 'Nama toko tidak disebutkan'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Waktu Lapor</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedLaporan.createdAt)}</p>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-[#3a5dcf] font-bold rounded-md mt-1 inline-block border border-blue-200/50">{selectedLaporan.tiket}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kronologi */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#3a5dcf]" /> Kronologi Kejadian
              </p>
              <div className="bg-white p-5 rounded-[20px] border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{selectedLaporan.kronologi}&rdquo;
              </div>
            </div>

            {/* Foto Bukti */}
            {selectedLaporan.fotoBukti && (
              <div className="space-y-2">
                <p className="text-[13px] font-bold text-gray-900">Foto Bukti Lampiran</p>
                <div className="bg-gray-50 p-3 rounded-[24px] border border-gray-100 inline-block overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedLaporan.fotoBukti}`}
                    alt="Bukti Laporan"
                    className="rounded-[18px] max-h-80 w-full object-cover shadow-sm hover:scale-[1.02] transition-transform duration-500 grayscale-[0.2] hover:grayscale-0"
                  />
                </div>
              </div>
            )}

            {/* Catatan Petugas */}
            <div className="p-5 bg-blue-50/50 rounded-[20px] border border-blue-100/50">
              <p className="text-[13px] font-bold text-[#3a5dcf] mb-2 flex items-center gap-2 uppercase tracking-wide">
                <Edit3 className="w-3.5 h-3.5" /> Catatan Petugas
              </p>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                {selectedLaporan.catatanPetugas || 'Belum ada catatan dari petugas pengawas.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-bold text-gray-900">Update Status Laporan</span>
          </div>
        }
        open={isStatusOpen}
        onCancel={() => setIsStatusOpen(false)}
        onOk={handleUpdateStatus}
        confirmLoading={updateStatus.isPending}
        okText="Update Status"
        cancelText="Batal"
        centered
        width={480}
        okButtonProps={{ className: 'bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] border-none font-bold h-10 rounded-xl' }}
        cancelButtonProps={{ className: 'font-bold h-10 rounded-xl' }}
      >
        {selectedLaporan && (
          <div className="mt-6 space-y-5">
            <div className="px-4 py-3 bg-blue-50/50 border border-blue-100/50 rounded-xl flex justify-between items-center">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Tiket</span>
              <span className="font-mono font-bold text-[#3a5dcf]">{selectedLaporan.tiket}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Pilih Status Baru</label>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: '100%' }}
                className="modern-select h-12"
                options={Object.entries(STATUS_LAPORAN).map(([key, val]) => ({
                  value: key,
                  label: val.label,
                }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Catatan Follow Up</label>
              <textarea
                rows={4}
                placeholder="Tuliskan tindakan yang diambil atau verifikasi yang dilakukan..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/30 transition-all font-medium placeholder:text-gray-400"
              ></textarea>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .ant-select-selector {
          border-radius: 12px !important;
          border-color: #f3f4f6 !important;
          background-color: #f9fafb !important;
          height: 46px !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #3a5dcf !important;
          box-shadow: 0 0 0 4px rgba(58, 93, 207, 0.05) !important;
        }
        .modern-select .ant-select-selector {
           height: 48px !important;
        }
        .admin-modern-modal .ant-modal-content {
          border-radius: 32px;
          padding: 24px;
        }
      `}</style>
    </div>
  );
}
