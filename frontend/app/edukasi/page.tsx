'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useArtikel } from '@/lib/hooks';
import { ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';

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
  const router = useRouter();

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
            <p className="text-sm text-blue-200/90 font-medium">Pelajari tentang keamanan dan stabilitas pangan</p>
          </div>
        </div>

        <div className="px-5 pb-8 max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
              <span className="text-[12px] font-medium text-gray-400">Memuat edukasi...</span>
            </div>
          ) : artikelList.length === 0 ? (
            <div className="text-center py-12 px-5 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mx-auto mb-4 border border-gray-100">
                <BookOpen className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-800 mb-1">Belum ada artikel</h3>
              <p className="text-[12px] text-gray-400">Arkhiv edukasi akan segera ditambahkan</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {artikelList.map((artikel: any) => {
                const colors = WARNA_MAP[artikel.warna] || WARNA_MAP.blue;

                return (
                  <div
                    key={artikel.id}
                    onClick={() => router.push(`/edukasi/${artikel.id}`)}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-[20px] transition-transform duration-300 group-hover:scale-110 ${colors.bg} ${colors.text}`}>
                        <i className={`fas fa-${artikel.ikon || 'book'}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-primary transition-colors">
                          {artikel.judul}
                        </h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 font-medium">
                          {artikel.isi}
                        </p>
                        
                        <div className="flex items-center gap-1 mt-3 text-[11px] font-bold text-primary group-hover:text-primary-light transition-colors">
                          Baca selengkapnya
                          <ChevronRight className="w-3 h-3 mt-0.5" />
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
