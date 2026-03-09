'use client';

import { useState } from 'react';
import { Modal, Input, Select } from 'antd';
import toast from 'react-hot-toast';
import { useArtikel, useCreateArtikel, useUpdateArtikel, useDeleteArtikel } from '@/lib/hooks';
import { formatDateShort } from '@/lib/utils';

const { TextArea } = Input;

const IKON_OPTIONS = [
  { value: 'book', label: '📖 Book' },
  { value: 'shield-halved', label: '🛡️ Shield' },
  { value: 'user-shield', label: '👤 User Shield' },
  { value: 'box-archive', label: '📦 Archive' },
  { value: 'calendar-xmark', label: '📅 Calendar' },
  { value: 'lightbulb', label: '💡 Lightbulb' },
  { value: 'leaf', label: '🍃 Leaf' },
  { value: 'heart', label: '❤️ Heart' },
];

const WARNA_OPTIONS = [
  { value: 'blue', label: '🔵 Biru' },
  { value: 'green', label: '🟢 Hijau' },
  { value: 'red', label: '🔴 Merah' },
  { value: 'purple', label: '🟣 Ungu' },
  { value: 'yellow', label: '🟡 Kuning' },
  { value: 'orange', label: '🟠 Oranye' },
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
      content: `Yakin ingin menghapus "${judul}"?`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Artikel Edukasi</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola konten edukasi keamanan pangan</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Artikel
        </button>
      </div>

      {/* Articles List */}
      <div className="admin-card">
        {isLoading ? (
          <div className="loading-center py-12">
            <div className="spinner"></div>
          </div>
        ) : artikelList.length === 0 ? (
          <div className="empty-state py-12">
            <i className="fas fa-newspaper"></i>
            <h3>Belum ada artikel</h3>
            <p>Klik tombol &quot;Tambah Artikel&quot; untuk menambah</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Ikon</th>
                  <th>Warna</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {artikelList.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <div>
                        <p className="font-medium text-gray-900">{item.judul}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.isi}</p>
                      </div>
                    </td>
                    <td>
                      <i className={`fas fa-${item.ikon} text-lg text-gray-600`}></i>
                    </td>
                    <td>
                      <span className={`badge badge-${item.warna}`}>{item.warna}</span>
                    </td>
                    <td className="text-sm text-gray-500">{formatDateShort(item.updatedAt)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '6px 10px' }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '6px 10px' }}
                        >
                          <i className="fas fa-trash"></i>
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

      {/* Create/Edit Modal — Ant Design */}
      <Modal
        title={<span className="font-bold">{editData ? 'Edit Artikel' : 'Tambah Artikel Baru'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={createArtikel.isPending || updateArtikel.isPending}
        okText="Simpan"
        cancelText="Batal"
        width={600}
      >
        <div className="mt-4 space-y-4">
          <div className="form-group mb-0">
            <label className="form-label">Judul Artikel</label>
            <Input
              size="large"
              placeholder="Judul artikel edukasi"
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Isi Artikel</label>
            <TextArea
              rows={6}
              placeholder="Tulis isi artikel edukasi..."
              value={formIsi}
              onChange={(e) => setFormIsi(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Ikon</label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formIkon}
                onChange={setFormIkon}
                options={IKON_OPTIONS}
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Warna</label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formWarna}
                onChange={setFormWarna}
                options={WARNA_OPTIONS}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
