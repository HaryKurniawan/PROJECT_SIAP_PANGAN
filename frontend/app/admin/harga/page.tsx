'use client';

import { useState } from 'react';
import { Modal, Input, InputNumber, Select } from 'antd';
import toast from 'react-hot-toast';
import { useHarga, useCreateHarga, useUpdateHarga, useDeleteHarga } from '@/lib/hooks';
import { formatRupiah, formatDate } from '@/lib/utils';

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
      content: `Yakin ingin menghapus "${nama}"?`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Harga Pangan</h2>
          <p className="text-gray-500 text-sm mt-1">Tambah dan perbarui harga bahan pokok</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Harga
        </button>
      </div>

      {/* Search */}
      <div className="admin-card mb-6">
        <div className="admin-card-body py-3">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              type="search"
              placeholder="Cari komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        {isLoading ? (
          <div className="loading-center py-12">
            <div className="spinner"></div>
          </div>
        ) : hargaList.length === 0 ? (
          <div className="empty-state py-12">
            <i className="fas fa-tags"></i>
            <h3>Belum ada data harga</h3>
            <p>Klik tombol &quot;Tambah Harga&quot; untuk menambah</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Komoditas</th>
                  <th>Harga</th>
                  <th>Satuan</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hargaList.map((item: any) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.nama}</td>
                    <td className="font-bold text-blue-600">{formatRupiah(item.harga)}</td>
                    <td className="text-gray-500">{item.satuan}</td>
                    <td>
                      <span className={`badge ${item.status === 'normal' ? 'badge-green' : 'badge-yellow'}`}>
                        {item.status === 'normal' ? '✓ Normal' : '⚠ Tinggi'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">{formatDate(item.updatedAt)}</td>
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
                          onClick={() => handleDelete(item.id, item.nama)}
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
        title={<span className="font-bold">{editData ? 'Edit Harga' : 'Tambah Harga Baru'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={createHarga.isPending || updateHarga.isPending}
        okText="Simpan"
        cancelText="Batal"
        width={480}
      >
        <div className="mt-4 space-y-4">
          <div className="form-group mb-0">
            <label className="form-label">Nama Komoditas</label>
            <Input
              size="large"
              placeholder="Contoh: Beras Premium"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Harga (Rp)</label>
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              placeholder="Contoh: 13000"
              value={formHarga}
              onChange={(val) => setFormHarga(val || 0)}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value) => parseInt(value?.replace(/\./g, '') || '0', 10) as any}
              min={0}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Satuan</label>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={formSatuan}
              onChange={setFormSatuan}
              options={[
                { value: '/kg', label: 'Per Kilogram (/kg)' },
                { value: '/liter', label: 'Per Liter (/liter)' },
                { value: '/butir', label: 'Per Butir (/butir)' },
                { value: '/ikat', label: 'Per Ikat (/ikat)' },
              ]}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Status</label>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={formStatus}
              onChange={setFormStatus}
              options={[
                { value: 'normal', label: '✓ Normal' },
                { value: 'tinggi', label: '⚠ Tinggi' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
