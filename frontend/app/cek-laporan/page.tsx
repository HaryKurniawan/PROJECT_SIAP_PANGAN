'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useCekLaporan } from '@/lib/hooks';
import { getTicketHistory, searchTicketHistory, updateTicketStatus } from '@/lib/ticket-storage';
import { STATUS_LAPORAN } from '@/lib/schemas';
import type { TicketHistoryItem } from '@/lib/ticket-storage';

export default function CekLaporanPage() {
  const [inputTiket, setInputTiket] = useState('');
  const [searchTiket, setSearchTiket] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [ticketHistory, setTicketHistory] = useState<TicketHistoryItem[]>([]);

  const { data, isLoading, isError, error } = useCekLaporan(searchTiket);

  useEffect(() => {
    setTicketHistory(getTicketHistory());
  }, []);

  useEffect(() => {
    if (historySearch) {
      setTicketHistory(searchTicketHistory(historySearch));
    } else {
      setTicketHistory(getTicketHistory());
    }
  }, [historySearch]);

  // Update localStorage when status is fetched
  useEffect(() => {
    if (data?.data) {
      updateTicketStatus(data.data.tiket, data.data.status);
      setTicketHistory(getTicketHistory());
    }
  }, [data]);

  const handleSearch = () => {
    if (inputTiket.trim()) {
      setSearchTiket(inputTiket.trim().toUpperCase());
    }
  };

  const handleHistoryClick = (tiket: string) => {
    setInputTiket(tiket);
    setSearchTiket(tiket);
  };

  const statusInfo = data?.data?.status
    ? STATUS_LAPORAN[data.data.status as keyof typeof STATUS_LAPORAN]
    : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-primary-dark to-primary shadow-lg h-16 px-4 flex items-center">
        <div className="max-w-6xl w-full mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-lg">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div>
            <h1 className="text-white text-base font-bold tracking-tight leading-tight">SIAP PANGAN</h1>
            <p className="text-blue-200 text-xs font-medium">Polres Brebes</p>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-gray-50">
        <div className="bg-gradient-to-br from-primary-dark to-primary px-5 pt-6 pb-12 text-white relative">
          <div className="absolute -bottom-px left-0 right-0 h-6 bg-gray-50 rounded-t-[24px]"></div>
          
          <div className="max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white mb-4 transition-colors">
              <i className="fas fa-arrow-left"></i> Kembali
            </Link>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Lacak Status Laporan</h2>
            <p className="text-sm text-blue-200/90">Masukkan nomor tiket untuk melihat status</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 pb-8 max-w-2xl mx-auto">
          {/* Search Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 mb-6 relative z-20">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <i className="fas fa-ticket-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="SPB-..."
                  value={inputTiket}
                  onChange={(e) => setInputTiket(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[15px] font-mono font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-shrink-0 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-search text-lg"></i>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-500">Mencari laporan...</span>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-2.5 bg-red-50/80 border border-red-200 text-red-800 p-4 rounded-xl text-[13px] font-medium leading-relaxed mb-6">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
              <span>{(error as any)?.response?.data?.message || 'Laporan tidak ditemukan'}</span>
            </div>
          )}

          {data?.data && (
            <div className="bg-white rounded-[20px] shadow-md border border-gray-100 mb-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight">Detail Laporan</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold leading-none capitalize
                  ${statusInfo?.color === 'green' && 'bg-emerald-100 text-emerald-700'}
                  ${statusInfo?.color === 'yellow' && 'bg-amber-100 text-amber-700'}
                  ${statusInfo?.color === 'orange' && 'bg-orange-100 text-orange-700'}
                  ${statusInfo?.color === 'blue' && 'bg-blue-100 text-blue-700'}
                  ${!statusInfo?.color && 'bg-blue-100 text-blue-700'}
                `}>
                  <i className={`fas fa-${statusInfo?.icon || 'info'}`}></i>
                  {statusInfo?.label || data.data.status}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex flex-col gap-3">
                  {[
                    ['Nomor Tiket', data.data.tiket],
                    ['Komoditas', data.data.komoditas],
                    ['Kecamatan', data.data.kecamatan],
                    ['Tanggal Lapor', formatDate(data.data.createdAt)],
                    ['Update Terakhir', formatDate(data.data.updatedAt)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-[13px] font-medium text-gray-500">{label}</span>
                      <span className={`text-[13px] ${label === 'Nomor Tiket' ? 'font-mono text-[14px] text-primary tracking-wide' : ''} font-bold text-gray-900 text-right`}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Status Timeline */}
                {data.data.statusLogs?.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-[14px] font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <i className="fas fa-history text-gray-400"></i>
                      Riwayat Status
                    </h4>
                    <div className="relative pl-7 border-l-2 border-gray-100 ml-2.5">
                      {data.data.statusLogs.map((log: any, idx: number) => {
                        const logInfo = STATUS_LAPORAN[log.status as keyof typeof STATUS_LAPORAN];
                        const isActive = idx === 0;
                        return (
                          <div key={idx} className="relative pb-6 last:pb-0">
                            <div className={`absolute -left-[35px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white z-10 
                              ${isActive ? 'bg-primary ring-4 ring-primary/10' : 'bg-gray-300'}
                            `}>
                              <i className={`fas fa-${logInfo?.icon || 'circle'}`}></i>
                            </div>
                            <div className="pt-1">
                              <h4 className={`text-[14px] font-bold leading-none mb-1.5 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                {logInfo?.label || log.status}
                              </h4>
                              {log.catatan && <p className="text-[13px] text-gray-600 leading-relaxed mb-2 bg-gray-50 p-3 rounded-xl border border-gray-100">{log.catatan}</p>}
                              <p className="text-[11px] font-medium text-gray-400">{formatDate(log.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ticket History from localStorage */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Riwayat Tiket</h3>
                <p className="text-[12px] font-medium text-gray-500 mt-0.5">Disimpan di perangkat ini</p>
              </div>
              {ticketHistory.length > 0 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">
                  {ticketHistory.length}
                </span>
              )}
            </div>

            {/* Search history */}
            {ticketHistory.length > 2 && (
              <div className="relative mb-4">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="search"
                  placeholder="Cari tiket, komoditas..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            )}

            {ticketHistory.length === 0 ? (
              <div className="text-center py-12 px-5 bg-white rounded-[20px] border border-gray-100 shadow-sm border-dashed">
                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-4">
                  <i className="fas fa-ticket-alt text-2xl text-gray-300"></i>
                </div>
                <h3 className="text-[15px] font-bold text-gray-800 mb-1">Belum ada riwayat</h3>
                <p className="text-[13px] text-gray-500 max-w-[200px] mx-auto leading-relaxed">Tiket laporan yang Anda buat akan muncul di sini</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {ticketHistory.map((ticket) => {
                  const info = STATUS_LAPORAN[ticket.status as keyof typeof STATUS_LAPORAN];
                  return (
                    <div
                      key={ticket.tiket}
                      onClick={() => handleHistoryClick(ticket.tiket)}
                      className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                    >
                      <div>
                        <div className="text-[15px] font-extrabold text-primary font-mono tracking-wide mb-1 group-hover:text-primary-dark transition-colors">{ticket.tiket}</div>
                        <div className="text-[12px] font-medium text-gray-500">
                          {ticket.komoditas} <span className="text-gray-300 mx-1">•</span> {ticket.kecamatan}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${info?.color === 'green' && 'bg-emerald-50 text-emerald-700'}
                        ${info?.color === 'yellow' && 'bg-amber-50 text-amber-700'}
                        ${info?.color === 'orange' && 'bg-orange-50 text-orange-700'}
                        ${info?.color === 'blue' && 'bg-blue-50 text-blue-700'}
                        ${!info?.color && 'bg-blue-50 text-blue-700'}
                      `}>
                        {info?.label || ticket.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
