'use client';

import { useAdminStats, useAdminLaporan } from '@/lib/hooks';
import { STATUS_LAPORAN } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { FileText, Inbox, Clock, CheckCircle, TrendingUp, ChevronRight, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const { data: laporanData, isLoading: isLaporanLoading } = useAdminLaporan({ page: 1, limit: 10 });
  const stats = data?.data;
  const laporanList = laporanData?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center" style={{ minHeight: '50vh' }}>
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500">Memuat dashboard...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Laporan', value: stats?.total || 0, icon: FileText, gradient: 'from-[#2143B1] to-[#3a5dcf]', bg: 'bg-blue-50', iconColor: 'text-[#3a5dcf]' },
    { label: 'Diterima', value: stats?.statusCount?.diterima || 0, icon: Inbox, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { label: 'Diproses', value: (stats?.statusCount?.diverifikasi || 0) + (stats?.statusCount?.diproses || 0), icon: Clock, gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { label: 'Selesai', value: stats?.statusCount?.selesai || 0, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Monitoring laporan pelanggaran pangan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Laporan Terbaru */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3a5dcf]" strokeWidth={2.5} />
              Laporan Terbaru
            </h3>
            <Link href="/admin/laporan" className="text-sm text-[#3a5dcf] font-semibold hover:text-[#2143B1] flex items-center gap-1 transition-colors">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
          <div>
            {stats?.laporanTerbaru?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {stats.laporanTerbaru.map((lap: any) => {
                  const statusInfo = STATUS_LAPORAN[lap.status as keyof typeof STATUS_LAPORAN];
                  return (
                    <div key={lap.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm text-[#3a5dcf]">{lap.tiket}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${lap.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                lap.status === 'diterima' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                                'bg-amber-50 text-amber-600 border border-amber-100'}`}>
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
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Inbox className="w-8 h-8 mb-2" strokeWidth={1.5} />
                <p className="text-sm font-medium">Belum ada laporan</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistik Per Kecamatan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Laporan per Kecamatan</h3>
          </div>
          <div className="p-5">
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
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3a5dcf, #2143B1)' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <p className="text-sm font-medium">Belum ada data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daftar Aduan Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3a5dcf]" strokeWidth={2.5} />
            Daftar Aduan
          </h3>
          <Link href="/admin/laporan" className="text-sm text-[#3a5dcf] font-semibold hover:text-[#2143B1] flex items-center gap-1 transition-colors">
            Kelola Semua <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        {isLaporanLoading ? (
          <div className="flex flex-col gap-2 items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400 font-medium">Memuat data...</span>
          </div>
        ) : laporanList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Inbox className="w-10 h-10 mb-3" strokeWidth={1.5} />
            <p className="text-sm font-bold text-gray-500">Tidak ada aduan</p>
            <p className="text-xs text-gray-400 mt-1">Belum ada laporan pengaduan masuk</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tiket</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pelapor</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Komoditas</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kecamatan</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {laporanList.map((lap: any) => {
                  const statusInfo = STATUS_LAPORAN[lap.status as keyof typeof STATUS_LAPORAN];
                  return (
                    <tr key={lap.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-[#3a5dcf] text-sm">{lap.tiket}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{lap.nama}</td>
                      <td className="px-5 py-3.5 text-gray-600">{lap.komoditas}</td>
                      <td className="px-5 py-3.5 text-gray-600">{lap.kecamatan}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${lap.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            lap.status === 'diterima' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                            lap.status === 'ditolak' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {statusInfo?.label || lap.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{formatDate(lap.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <Link
                          href="/admin/laporan"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#3a5dcf] rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
