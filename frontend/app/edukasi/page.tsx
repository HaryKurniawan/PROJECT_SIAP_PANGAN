'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useArtikel } from '@/lib/hooks';

const WARNA_MAP: Record<string, { bg: string; text: string; light: string }> = {
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', light: 'bg-emerald-50' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', light: 'bg-blue-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', light: 'bg-purple-50' },
  red: { bg: 'bg-red-100', text: 'text-red-600', light: 'bg-red-50' },
  yellow: { bg: 'bg-amber-100', text: 'text-amber-600', light: 'bg-amber-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', light: 'bg-orange-50' },
};

export default function EdukasiPage() {
  const { data, isLoading } = useArtikel();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const artikelList = data?.data || [];

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
            <h2 className="text-2xl font-bold tracking-tight mb-1">Edukasi Pangan</h2>
            <p className="text-sm text-blue-200/90">Pelajari tentang keamanan dan stabilitas pangan</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 pb-8 max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-500">Memuat artikel...</span>
            </div>
          ) : artikelList.length === 0 ? (
            <div className="text-center py-12 px-5 bg-white rounded-[20px] border border-gray-100 shadow-sm border-dashed">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-book text-2xl text-gray-300"></i>
              </div>
              <h3 className="text-[15px] font-bold text-gray-800 mb-1">Belum ada artikel</h3>
              <p className="text-[13px] text-gray-500">Artikel edukasi akan segera ditambahkan</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {artikelList.map((artikel: any) => {
                const colors = WARNA_MAP[artikel.warna] || WARNA_MAP.blue;
                const isExpanded = expandedId === artikel.id;

                return (
                  <div
                    key={artikel.id}
                    onClick={() => setExpandedId(isExpanded ? null : artikel.id)}
                    className="bg-white rounded-[20px] p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-[20px] transition-transform duration-300 group-hover:scale-110 ${colors.bg} ${colors.text}`}>
                        <i className={`fas fa-${artikel.ikon || 'book'}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-extrabold text-gray-900 mb-1.5 leading-tight group-hover:text-primary transition-colors">
                          {artikel.judul}
                        </h4>
                        <p className={`text-[13px] text-gray-600 leading-relaxed transition-all ${isExpanded ? 'block' : 'line-clamp-2'}`}>
                          {artikel.isi}
                        </p>
                        
                        <div className={`flex items-center gap-1.5 mt-3 text-[12px] font-bold transition-colors ${isExpanded ? 'text-gray-500' : 'text-primary group-hover:text-primary-light'}`}>
                          {isExpanded ? 'Lebih sedikit' : 'Baca selengkapnya'}
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
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
