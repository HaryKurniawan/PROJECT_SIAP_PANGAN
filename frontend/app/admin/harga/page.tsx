'use client';

import { useState } from 'react';
import { Modal, Input, InputNumber, Select } from 'antd';
import toast from 'react-hot-toast';
import { useHarga, useCreateHarga, useUpdateHarga, useDeleteHarga } from '@/lib/hooks';
import { formatRupiah, formatDate } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  Wheat, 
  Droplets, 
  Package, 
  Leaf, 
  Egg,
  TrendingUp,
  AlertTriangle,
  Clock,
  History,
  Tag
} from 'lucide-react';

export default function AdminHargaPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Form state
  const [formNama, setFormNama] = useState('');
  const [formHarga, setFormHarga] = useState<number>(0);
  const [formSatuan, setFormSatuan] = useState('');
  const [formStatus, setFormStatus] = useState('normal');

  const { data, isLoading } = useHarga(search);
  const createHarga = useCreateHarga();
  const updateHarga = useUpdateHarga();
  const deleteHarga = useDeleteHarga();

  const hargaList = data?.data || [];

  const openCreate = () => {
    setEditData(null);
    setFormNama('');
    setFormHarga(0);
    setFormSatuan('/kg');
    setFormStatus('normal');
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditData(item);
    setFormNama(item.nama);
    setFormHarga(item.harga);
    setFormSatuan(item.satuan);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formNama || !formHarga || !formSatuan) {
      toast.error('Semua field wajib diisi');
      return;
    }

    try {
      if (editData) {
        await updateHarga.mutateAsync({
          id: editData.id,
          nama: formNama,
          harga: formHarga,
          satuan: formSatuan,
          status: formStatus as 'normal' | 'tinggi',
        });
        toast.success('Harga berhasil diperbarui');
      } else {
        await createHarga.mutateAsync({
          nama: formNama,
          harga: formHarga,
          satuan: formSatuan,
          status: formStatus as 'normal' | 'tinggi',
        });
        toast.success('Harga berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = (id: number, nama: string) => {
    Modal.confirm({
      title: 'Hapus Harga',
      content: `Yakin ingin menghapus "${nama}"? Aksi ini akan menghapus data permanen.`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      centered: true,
      onOk: async () => {
        try {
          await deleteHarga.mutateAsync(id);
          toast.success('Harga berhasil dihapus');
        } catch {
          toast.error('Gagal menghapus');
        }
      },
    });
  };

  const getIcon = (nama: string) => {
    const lowNama = nama.toLowerCase();
    if (lowNama.includes('beras')) return <Wheat className="w-5 h-5" />;
    if (lowNama.includes('minyak')) return <Droplets className="w-5 h-5" />;
    if (lowNama.includes('bawang') || lowNama.includes('cabai')) return <Leaf className="w-5 h-5" />;
    if (lowNama.includes('telur')) return <Egg className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  const getIconBg = (nama: string) => {
    const lowNama = nama.toLowerCase();
    if (lowNama.includes('beras')) return 'bg-amber-50 text-amber-600 border-amber-100/50';
    if (lowNama.includes('minyak')) return 'bg-blue-50 text-blue-600 border-blue-100/50';
    if (lowNama.includes('bawang') || lowNama.includes('cabai')) return 'bg-emerald-50 text-emerald-600 border-emerald-100/50';
    if (lowNama.includes('telur')) return 'bg-orange-50 text-orange-600 border-orange-100/50';
    return 'bg-gray-50 text-gray-600 border-gray-100/50';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Harga Pangan</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau dan update harga bahan pokok komoditas Kabupaten Brebes</p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Tambah Harga
        </button>
      </div>

      {/* Search Layout */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2.5} />
            <input
              type="search"
              placeholder="Cari nama komoditas (contoh: Beras)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/30 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
             <span className="text-sm font-medium text-gray-500">Memuat data harga...</span>
          </div>
        ) : hargaList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <Tag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Belum ada data harga</h3>
            <p className="text-gray-500 text-sm max-w-[280px]">Mulai dengan menambahkan data harga bahan pokok baru</p>
            <button 
                onClick={openCreate}
                className="mt-6 text-[13px] font-bold text-[#3a5dcf] hover:text-[#2143B1] flex items-center gap-1 group"
            >
                Tambah data pertama <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 uppercase tracking-wider text-[11px] font-bold text-gray-400">
                  <th className="px-6 py-5 border-b border-gray-50">Komoditas</th>
                  <th className="px-6 py-5 border-b border-gray-50">Harga Acuan</th>
                  <th className="px-6 py-5 border-b border-gray-50 text-center">Status</th>
                  <th className="px-6 py-5 border-b border-gray-50">Update Terakhir</th>
                  <th className="px-6 py-5 border-b border-gray-50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hargaList.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center border ${getIconBg(item.nama)} transition-transform group-hover:scale-110 duration-300`}>
                          {getIcon(item.nama)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-[15px]">{item.nama}</p>
                          <p className="text-[12px] text-gray-400 font-medium">Kabupaten Brebes</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-[17px] text-[#3a5dcf] tracking-tight">{formatRupiah(item.harga)}</span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">/{item.satuan.replace('/', '')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border leading-none
                        ${item.status === 'normal' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                        >
                        {item.status === 'normal' ? '✓ Stabil' : '⚠ Awasi'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5 text-gray-500 font-medium text-[13px]">
                         <Clock className="w-3.5 h-3.5 text-gray-300" />
                         {formatDate(item.updatedAt)}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#3a5dcf] hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal — Custom Styling */}
      <Modal
        title={
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editData ? 'bg-blue-50' : 'bg-emerald-50'}`}>
              <Tag className={`w-4 h-4 ${editData ? 'text-[#3a5dcf]' : 'text-emerald-500'}`} />
            </div>
            <span className="font-bold text-gray-900">{editData ? 'Perbarui Data Komoditas' : 'Tambah Komoditas Baru'}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={createHarga.isPending || updateHarga.isPending}
        okText="Simpan Data"
        cancelText="Batal"
        centered
        width={480}
        okButtonProps={{ className: 'bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] border-none font-bold h-11 rounded-xl px-6' }}
        cancelButtonProps={{ className: 'font-bold h-11 rounded-xl px-6' }}
        className="admin-modern-modal"
      >
        <div className="mt-6 space-y-5 px-1 pb-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 ml-1">Nama Komoditas</label>
            <Input
              size="large"
              placeholder="Contoh: Beras Premium"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-medium"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Harga (Rp)</label>
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                placeholder="Contoh: 15000"
                value={formHarga}
                onChange={(val) => setFormHarga(val || 0)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => parseInt(value?.replace(/\./g, '') || '0', 10) as any}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold text-[#3a5dcf]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Satuan</label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formSatuan}
                onChange={setFormSatuan}
                className="modern-select h-12"
                options={[
                  { value: '/kg', label: 'Per kg' },
                  { value: '/liter', label: 'Per liter' },
                  { value: '/butir', label: 'Per butir' },
                  { value: '/ikat', label: 'Per ikat' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 ml-1">Status Harga Saat Ini</label>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={formStatus}
              onChange={setFormStatus}
              className="modern-select h-12"
              options={[
                { value: 'normal', label: '✓ Harga Stabil' },
                { value: 'tinggi', label: '⚠ Terjadi Kenaikan' },
              ]}
            />
          </div>

          {!editData && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 mt-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Data yang ditambahkan akan muncul di halaman publik dan dapat dilihat oleh masyarakat Kabupaten Brebes.
              </p>
            </div>
          )}
        </div>
      </Modal>

      <style jsx global>{`
        .ant-modal-content {
          border-radius: 32px !important;
          padding: 24px !important;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
        }
        .ant-select-selector {
          border-radius: 12px !important;
          border-color: #f3f4f6 !important;
          background-color: #f9fafb !important;
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #3a5dcf !important;
          box-shadow: 0 0 0 4px rgba(58, 93, 207, 0.05) !important;
        }
        .ant-input-number-input {
          font-weight: 700 !important;
        }
        .ant-modal-header {
            margin-bottom: 0 !important;
            border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
