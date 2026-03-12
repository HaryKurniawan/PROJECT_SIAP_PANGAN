'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useArtikelDetail } from '@/lib/hooks';

const WARNA_MAP: Record<string, { bg: string; text: string; light: string }> = {
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', light: 'bg-emerald-50' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', light: 'bg-blue-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', light: 'bg-purple-50' },
  red: { bg: 'bg-red-100', text: 'text-red-600', light: 'bg-red-50' },
  yellow: { bg: 'bg-amber-100', text: 'text-amber-600', light: 'bg-amber-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', light: 'bg-orange-50' },
};

export default function EdukasiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  const { data, isLoading, error } = useArtikelDetail(id);

  const artikel = data?.data;
  const colors = artikel ? (WARNA_MAP[artikel.warna] || WARNA_MAP.blue) : WARNA_MAP.blue;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-primary-dark to-primary shadow-lg h-16 px-4 flex items-center">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-white text-base font-bold tracking-tight leading-tight">Detail Edukasi</h1>
              <p className="text-blue-200 text-xs font-medium">Polres Brebes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-12 min-h-[100dvh] bg-gray-50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-500">Memuat artikel...</span>
          </div>
        ) : error || !artikel ? (
          <div className="px-5 py-20 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-gray-500 text-sm mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
            <Link 
              href="/edukasi"
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary-dark transition-all"
            >
              Kembali ke Edukasi
            </Link>
          </div>
        ) : (
          <article>
            <div className={`bg-gradient-to-br from-primary-dark to-primary px-5 pt-6 pb-20 text-white relative`}>
              <div className="absolute -bottom-px left-0 right-0 h-10 bg-gray-50 rounded-t-[32px]"></div>
              
              <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-xl shadow-black/5`}>
                  <i className={`fas fa-${artikel.ikon || 'book'}`}></i>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2 leading-tight">
                  {artikel.judul}
                </h2>
                <div className="flex items-center gap-2 text-blue-100 text-[12px] font-medium opacity-80">
                  <i className="far fa-calendar-alt"></i>
                  <span>{new Date(artikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="px-5 -mt-10 relative z-10 max-w-2xl mx-auto">
              <div className="bg-white rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                <div className="prose prose-sm prose-gray max-w-none">
                  {artikel.isi.split('\n').map((para: string, idx: number) => (
                    para ? <p key={idx} className="text-gray-700 text-[15px] leading-relaxed mb-4 font-medium">{para}</p> : <br key={idx} />
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-4 items-start border border-blue-100/50">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-lg"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-0.5">Informasi Pangan</h4>
                      <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
                        Artikel ini disediakan oleh Polres Brebes untuk meningkatkan kesadaran masyarakat tentang ketahanan pangan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>
    </>
  );
}
