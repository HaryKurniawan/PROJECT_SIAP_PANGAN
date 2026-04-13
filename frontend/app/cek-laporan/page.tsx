'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { useCekLaporan } from '@/lib/hooks';
import { getTicketHistory, searchTicketHistory, updateTicketStatus } from '@/lib/ticket-storage';
import { STATUS_LAPORAN } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import type { TicketHistoryItem } from '@/lib/ticket-storage';
import { ShieldCheck, Search, Ticket, ArrowLeft, Clock, MapPin, Package, Info, History, ChevronRight, AlertCircle, CheckCircle, Loader2, Inbox } from 'lucide-react';

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'selesai': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'diterima': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ditolak': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <>
      {/* Header matching home */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-[64px] px-6 flex items-center border-b border-gray-50/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
              <Image 
                src="/img/logo.jpeg" 
                alt="Logo SIAP PANGAN" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 text-[15px] font-black tracking-tight leading-none mb-0.5">SIAP PANGAN</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Kabupaten Brebes</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="pt-[64px] pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-[#fdfdfd]">
        {/* Title Section */}
        <div className="px-5 pt-6 pb-1 max-w-2xl mx-auto">
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-0.5">Lacak Status Laporan</h2>
          <p className="text-[12px] text-gray-400 font-medium">Masukkan nomor tiket untuk cek status</p>
        </div>

        <div className="px-5 pb-8 max-w-2xl mx-auto">
          {/* Search Card */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-4 mt-4 mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="SPB-..."
                  value={inputTiket}
                  onChange={(e) => setInputTiket(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-[14px] font-mono font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/20 transition-all text-gray-900 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-shrink-0 w-[52px] h-[52px] bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] hover:shadow-lg hover:shadow-blue-600/20 text-white rounded-xl shadow-sm flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
              <span className="text-[12px] font-medium text-gray-400">Mencari laporan...</span>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-[13px] font-medium leading-relaxed mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" strokeWidth={2.5} />
              <span>{(error as any)?.response?.data?.message || 'Laporan tidak ditemukan'}</span>
            </div>
          )}

          {/* Result Card */}
          {data?.data && (
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-8 overflow-hidden">
              {/* Status Header */}
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-[14px] font-extrabold text-gray-900 tracking-tight">Detail Laporan</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(data.data.status)}`}>
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
                      <span className="text-[12px] font-medium text-gray-400">{label}</span>
                      <span className={`text-[13px] ${label === 'Nomor Tiket' ? 'font-mono text-[14px] text-[#3a5dcf] tracking-wide' : 'text-gray-900'} font-bold text-right`}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Tindak Lanjut Section */}
                {(data.data.tindakLanjutKeterangan || data.data.tindakLanjutFoto) && (
                  <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-[20px]">
                    <h4 className="text-[13px] font-bold text-emerald-900 mb-3 flex items-center gap-2">
                       <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                       </div>
                       Tindak Lanjut Petugas
                    </h4>
                    
                    {data.data.tindakLanjutKeterangan && (
                      <p className="text-[12px] text-emerald-800 font-medium leading-relaxed mb-3 italic">
                        &ldquo;{data.data.tindakLanjutKeterangan}&rdquo;
                      </p>
                    )}

                    {data.data.tindakLanjutFoto && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                        <Image
                          src={data.data.tindakLanjutFoto}
                          alt="Bukti Tindak Lanjut"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Status Timeline */}
                {data.data.statusLogs?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-gray-400" strokeWidth={2} />
                      Riwayat Status
                    </h4>
                    <div className="relative pl-6 border-l-2 border-gray-100 ml-2">
                      {data.data.statusLogs.map((log: any, idx: number) => {
                        const logInfo = STATUS_LAPORAN[log.status as keyof typeof STATUS_LAPORAN];
                        const isActive = idx === 0;
                        return (
                          <div key={idx} className="relative pb-5 last:pb-0">
                            <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full flex items-center justify-center z-10 
                              ${isActive ? 'bg-[#3a5dcf] ring-4 ring-[#3a5dcf]/10' : 'bg-gray-200'}
                            `}>
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`}></div>
                            </div>
                            <div>
                              <h4 className={`text-[13px] font-bold leading-none mb-1 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {logInfo?.label || log.status}
                              </h4>
                              {log.catatan && (
                                <p className="text-[12px] text-gray-600 leading-relaxed mb-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1.5">{log.catatan}</p>
                              )}
                              <p className="text-[10px] font-medium text-gray-400">{formatDate(log.createdAt)}</p>
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

          {/* Ticket History */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Riwayat Tiket</h3>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">Disimpan di perangkat ini</p>
              </div>
              {ticketHistory.length > 0 && (
                <span className="px-2.5 py-1 bg-[#3a5dcf]/5 text-[#3a5dcf] rounded-full text-[11px] font-bold">
                  {ticketHistory.length}
                </span>
              )}
            </div>

            {/* Search history */}
            {ticketHistory.length > 2 && (
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" strokeWidth={2.5} />
                <input
                  type="search"
                  placeholder="Cari tiket, komoditas..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/20 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            )}

            {ticketHistory.length === 0 ? (
              <div className="text-center py-12 px-5 bg-white rounded-[20px] border border-gray-100 border-dashed shadow-sm">
                <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-3">
                  <Ticket className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-bold text-gray-700 mb-1">Belum ada riwayat</h3>
                <p className="text-[12px] text-gray-400 max-w-[200px] mx-auto leading-relaxed font-medium">Tiket laporan yang Anda buat akan muncul di sini</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {ticketHistory.map((ticket) => {
                  const info = STATUS_LAPORAN[ticket.status as keyof typeof STATUS_LAPORAN];
                  return (
                    <div
                      key={ticket.tiket}
                      onClick={() => handleHistoryClick(ticket.tiket)}
                      className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:border-[#3a5dcf]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div>
                        <div className="text-[14px] font-extrabold text-[#3a5dcf] font-mono tracking-wide mb-1 group-hover:text-[#2143B1] transition-colors">{ticket.tiket}</div>
                        <div className="text-[11px] font-medium text-gray-400">
                          {ticket.komoditas} <span className="text-gray-200 mx-1">•</span> {ticket.kecamatan}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyles(ticket.status)}`}>
                          {info?.label || ticket.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3a5dcf] transition-colors" strokeWidth={2} />
                      </div>
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
