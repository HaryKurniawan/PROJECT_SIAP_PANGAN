'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useArtikel } from '@/lib/hooks';
import { ShieldCheck, BookOpen, ChevronRight, Clock } from 'lucide-react';

const WARNA_MAP: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100/50' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100/50' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100/50' },
  yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/50' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100/50' },
};

export default function EdukasiPage() {
  const { data, isLoading } = useArtikel();
  const router = useRouter();

  const artikelList = data?.data || [];

  return (
    <>
      {/* Header matching home */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-[64px] px-6 flex items-center border-b border-gray-50/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center text-[#3a5dcf] bg-[#3a5dcf]/5 rounded-xl">
              <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 text-[15px] font-bold tracking-tight leading-none mb-0.5">SIAP PANGAN</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Kabupaten Brebes</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[64px] pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-[#fdfdfd]">
        {/* Title */}
        <div className="px-5 pt-6 pb-2 max-w-2xl mx-auto">
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-0.5">Edukasi Pangan</h2>
          <p className="text-[12px] text-gray-400 font-medium">Pelajari tentang keamanan dan stabilitas pangan</p>
        </div>

        <div className="px-5 pb-8 max-w-2xl mx-auto mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
              <span className="text-[12px] font-medium text-gray-400">Memuat edukasi...</span>
            </div>
          ) : artikelList.length === 0 ? (
            <div className="text-center py-14 px-5 bg-white rounded-[20px] border border-gray-100 border-dashed shadow-sm">
              <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-bold text-gray-700 mb-1">Belum ada artikel</h3>
              <p className="text-[12px] text-gray-400 font-medium">Arsip edukasi akan segera ditambahkan</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {artikelList.map((artikel: any) => {
                const colors = WARNA_MAP[artikel.warna] || WARNA_MAP.blue;

                return (
                  <div
                    key={artikel.id}
                    onClick={() => router.push(`/edukasi/${artikel.id}`)}
                    className="bg-white rounded-[20px] p-5 border border-gray-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 text-[20px] transition-transform duration-300 group-hover:scale-110 border ${colors.bg} ${colors.text} ${colors.border}`}>
                        <i className={`fas fa-${artikel.ikon || 'book'}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#3a5dcf] transition-colors">
                          {artikel.judul}
                        </h4>
                        <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 font-medium">
                          {artikel.isi}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {artikel.createdAt && (
                            <div className="flex items-center gap-1 text-[10px] text-gray-300 font-medium">
                              <Clock className="w-3 h-3" strokeWidth={2.5} />
                              {new Date(artikel.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#3a5dcf] group-hover:text-[#2143B1] transition-colors">
                            Baca
                            <ChevronRight className="w-3 h-3" strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
