'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useArtikelDetail } from '@/lib/hooks';
import { ShieldCheck, ArrowLeft, Calendar, Info, BookOpen, AlertTriangle } from 'lucide-react';

const WARNA_MAP: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100/50' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100/50' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100/50' },
  yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/50' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100/50' },
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-[64px] px-4 flex items-center border-b border-gray-50/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-auto flex items-center justify-center">
                <Image 
                  src="/img/logo.jpeg" 
                  alt="Logo SIAP PANGAN" 
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 text-[13px] font-semibold tracking-tight leading-none mb-0.5">Detail Edukasi</span>
                <span className="text-[#3a5dcf] text-[9px] font-medium tracking-wide">Siap Pangan</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[64px] pb-12 min-h-[100dvh] bg-[#fdfdfd]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
            <span className="text-[12px] font-medium text-gray-400">Memuat artikel...</span>
          </div>
        ) : error || !artikel ? (
          <div className="px-5 py-20 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-red-50 text-red-400 flex items-center justify-center rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-bold text-gray-800 mb-1">Artikel tidak ditemukan</h3>
            <p className="text-[13px] text-gray-400 mb-6 font-medium">Maaf, artikel yang Anda cari tidak tersedia.</p>
            <Link
              href="/edukasi"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Kembali ke Edukasi
            </Link>
          </div>
        ) : (
          <article>
            {/* Article Header */}
            <div className="px-5 pt-6 pb-5 max-w-2xl mx-auto">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0 text-[22px] border ${colors.bg} ${colors.text} ${colors.border}`}>
                  <i className={`fas fa-${artikel.ikon || 'book'}`}></i>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                    {artikel.judul}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <Calendar className="w-3 h-3" strokeWidth={2.5} />
                    <span>{new Date(artikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="px-5 max-w-2xl mx-auto">
              <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80">
                <div className="prose prose-sm prose-gray max-w-none">
                  {artikel.isi.split('\n').map((para: string, idx: number) => (
                    para ? <p key={idx} className="text-gray-600 text-[14px] leading-[1.8] mb-4 last:mb-0">{para}</p> : <br key={idx} />
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-50">
                  <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-3 items-start border border-blue-100/50">
                    <div className="w-9 h-9 bg-blue-100 text-[#3a5dcf] rounded-full flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-[#2143B1] mb-0.5">Informasi Pangan</h4>
                      <p className="text-[11px] text-blue-600/70 leading-relaxed font-medium">
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
