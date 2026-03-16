'use client';

import { useState } from 'react';
import { Modal, Input, Select } from 'antd';
import toast from 'react-hot-toast';
import { useArtikel, useCreateArtikel, useUpdateArtikel, useDeleteArtikel } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Newspaper, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Shield, 
  ShieldAlert, 
  Inbox, 
  Lightbulb, 
  Leaf, 
  Heart, 
  Calendar,
  FileText,
  Type,
  Palette
} from 'lucide-react';

const { TextArea } = Input;

const IKON_OPTIONS = [
  { value: 'book', label: '📖 Book', icon: BookOpen },
  { value: 'shield-halved', label: '🛡️ Shield', icon: Shield },
  { value: 'user-shield', label: '👤 Alert Shield', icon: ShieldAlert },
  { value: 'box-archive', label: '📦 Archive', icon: FileText },
  { value: 'lightbulb', label: '💡 Lightbulb', icon: Lightbulb },
  { value: 'leaf', label: '🍃 Leaf', icon: Leaf },
  { value: 'heart', label: '❤️ Heart', icon: Heart },
];

const WARNA_OPTIONS = [
  { value: 'blue', label: '🔵 Biru', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'green', label: '🟢 Hijau', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { value: 'red', label: '🔴 Merah', color: 'bg-red-50 text-red-600 border-red-100' },
  { value: 'purple', label: '🟣 Ungu', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'yellow', label: '🟡 Kuning', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { value: 'orange', label: '🟠 Oranye', color: 'bg-orange-50 text-orange-600 border-orange-100' },
];

export default function AdminArtikelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Form
  const [formJudul, setFormJudul] = useState('');
  const [formIsi, setFormIsi] = useState('');
  const [formIkon, setFormIkon] = useState('book');
  const [formWarna, setFormWarna] = useState('blue');

  const { data, isLoading } = useArtikel();
  const createArtikel = useCreateArtikel();
  const updateArtikel = useUpdateArtikel();
  const deleteArtikel = useDeleteArtikel();

  const artikelList = data?.data || [];

  const openCreate = () => {
    setEditData(null);
    setFormJudul('');
    setFormIsi('');
    setFormIkon('book');
    setFormWarna('blue');
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditData(item);
    setFormJudul(item.judul);
    setFormIsi(item.isi);
    setFormIkon(item.ikon);
    setFormWarna(item.warna);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formJudul || !formIsi) {
      toast.error('Judul dan isi wajib diisi');
      return;
    }

    try {
      if (editData) {
        await updateArtikel.mutateAsync({
          id: editData.id,
          judul: formJudul,
          isi: formIsi,
          ikon: formIkon,
          warna: formWarna,
        });
        toast.success('Artikel berhasil diperbarui');
      } else {
        await createArtikel.mutateAsync({
          judul: formJudul,
          isi: formIsi,
          ikon: formIkon,
          warna: formWarna,
        });
        toast.success('Artikel berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = (id: number, judul: string) => {
    Modal.confirm({
      title: 'Hapus Artikel',
      content: `Yakin ingin menghapus artikel "${judul}"?`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      centered: true,
      onOk: async () => {
        try {
          await deleteArtikel.mutateAsync(id);
          toast.success('Artikel berhasil dihapus');
        } catch {
          toast.error('Gagal menghapus');
        }
      },
    });
  };

  const getWarnaStyle = (warna: string) => {
    return WARNA_OPTIONS.find(o => o.value === warna)?.color || WARNA_OPTIONS[0].color;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edukasi Pangan</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola konten edukasi dan informasi untuk masyarakat Kabupaten Brebes</p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Tambah Artikel
        </button>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
             <span className="text-sm font-medium text-gray-500">Memuat data artikel...</span>
          </div>
        ) : artikelList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <Newspaper className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Belum ada artikel</h3>
            <p className="text-gray-500 text-sm max-w-[280px]">Bagikan informasi edukatif mengenai pangan kepada masyarakat</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 uppercase tracking-wider text-[11px] font-bold text-gray-400">
                  <th className="px-6 py-5 border-b border-gray-50">Isi Artikel</th>
                  <th className="px-6 py-5 border-b border-gray-50 text-center">Visual</th>
                  <th className="px-6 py-5 border-b border-gray-50">Update Terakhir</th>
                  <th className="px-6 py-5 border-b border-gray-50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {artikelList.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-5 max-w-md">
                      <div>
                        <p className="font-bold text-gray-900 text-[15px] group-hover:text-[#3a5dcf] transition-colors">{item.judul}</p>
                        <p className="text-[12px] text-gray-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                          {item.isi}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${getWarnaStyle(item.warna)}`}>
                             <i className={`fas fa-${item.ikon} text-[18px]`}></i>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.warna}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5 text-gray-500 font-medium text-[13px]">
                         <Calendar className="w-3.5 h-3.5 text-gray-300" />
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
                          onClick={() => handleDelete(item.id, item.judul)}
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
              <Newspaper className={`w-4 h-4 ${editData ? 'text-[#3a5dcf]' : 'text-emerald-500'}`} />
            </div>
            <span className="font-bold text-gray-900">{editData ? 'Perbarui Artikel Edukasi' : 'Tulis Artikel Baru'}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={createArtikel.isPending || updateArtikel.isPending}
        okText="Simpan Artikel"
        cancelText="Batal"
        centered
        width={640}
        okButtonProps={{ className: 'bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] border-none font-bold h-11 rounded-xl px-6' }}
        cancelButtonProps={{ className: 'font-bold h-11 rounded-xl px-6' }}
        className="admin-modern-modal"
      >
        <div className="mt-6 space-y-5 pb-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 ml-1 flex items-center gap-2">
               <Type className="w-4 h-4 text-[#3a5dcf]" /> Judul Artikel
            </label>
            <Input
              size="large"
              placeholder="Berikan judul yang menarik..."
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#3a5dcf]" /> Pilihan Ikon
              </label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formIkon}
                onChange={setFormIkon}
                className="modern-select h-12"
                options={IKON_OPTIONS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-500" /> Aksen Warna
              </label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formWarna}
                onChange={setFormWarna}
                className="modern-select h-12"
                options={WARNA_OPTIONS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 ml-1 flex items-center gap-2">
               <FileText className="w-4 h-4 text-[#3a5dcf]" /> Isi Konten Artikel
            </label>
            <TextArea
              rows={8}
              placeholder="Tuliskan pengetahuan atau informasi yang ingin disampaikan..."
              value={formIsi}
              onChange={(e) => setFormIsi(e.target.value)}
              className="rounded-2xl border-gray-100 bg-gray-50/50 p-4 font-medium leading-relaxed"
            />
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .ant-modal-content {
          border-radius: 32px !important;
          padding: 24px !important;
          border: 1px solid rgba(0,0,0,0.05);
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
        .ant-input {
          font-size: 14px !important;
        }
        .ant-modal-header {
            margin-bottom: 0 !important;
            border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
