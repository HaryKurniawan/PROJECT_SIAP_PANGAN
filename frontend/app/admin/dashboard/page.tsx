'use client';

import { useAdminStats } from '@/lib/hooks';
import { STATUS_LAPORAN } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="loading-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
        <span className="loading-text">Memuat dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Monitoring laporan pelanggaran pangan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Laporan', value: stats?.total || 0, icon: 'fa-file-alt', color: '#1D4ED8', bg: '#DBEAFE' },
          { label: 'Diterima', value: stats?.statusCount?.diterima || 0, icon: 'fa-inbox', color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Diproses', value: (stats?.statusCount?.diverifikasi || 0) + (stats?.statusCount?.diproses || 0), icon: 'fa-hourglass-half', color: '#D97706', bg: '#FEF3C7' },
          { label: 'Selesai', value: stats?.statusCount?.selesai || 0, icon: 'fa-check-circle', color: '#059669', bg: '#D1FAE5' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <i className={`fas ${stat.icon}`} style={{ color: stat.color }}></i>
              </div>
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Laporan Terbaru */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-bold text-gray-900">Laporan Terbaru</h3>
            <Link href="/admin/laporan" className="text-sm text-blue-600 font-medium hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="admin-card-body p-0">
            {stats?.laporanTerbaru?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.laporanTerbaru.map((lap: any) => {
                  const statusInfo = STATUS_LAPORAN[lap.status as keyof typeof STATUS_LAPORAN];
                  return (
                    <div key={lap.id} className="px-5 py-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm text-blue-600">{lap.tiket}</span>
                            <span className={`badge badge-${statusInfo?.color || 'blue'}`} style={{ fontSize: 11 }}>
                              {statusInfo?.label || lap.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{lap.nama}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {lap.komoditas} • {lap.kecamatan}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(lap.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state py-8">
                <i className="fas fa-inbox"></i>
                <h3>Belum ada laporan</h3>
              </div>
            )}
          </div>
        </div>

        {/* Statistik Per Kecamatan */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-bold text-gray-900">Laporan per Kecamatan</h3>
          </div>
          <div className="admin-card-body">
            {stats?.perKecamatan?.length > 0 ? (
              <div className="space-y-3">
                {stats.perKecamatan.map((item: any) => {
                  const maxVal = stats.perKecamatan[0]?.jumlah || 1;
                  const pct = (item.jumlah / maxVal) * 100;
                  return (
                    <div key={item.kecamatan}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.kecamatan}</span>
                        <span className="font-bold text-gray-900">{item.jumlah}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state py-4">
                <p className="text-sm text-gray-500">Belum ada data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
