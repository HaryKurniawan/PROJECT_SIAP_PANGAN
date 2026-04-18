'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { useHarga } from '@/lib/hooks';
import { ShieldCheck, ChevronRight, AlertTriangle, Search, TrendingUp, Info, Wheat, Droplets, Package } from 'lucide-react';

export default function HomePage() {
  const { data, isLoading } = useHarga();
  const hargaList = data?.data?.slice(0, 10) || []; // Ambil 10 teratas

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <>
      <Header />

      <main className="pt-[64px] pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-[#fdfdfd]">
        
        {/* Hero Banner Refined */}
        <section className="px-4 pt-5 max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#2143B1] via-[#3a5dcf] to-[#4a6bdf] rounded-[24px] p-6 md:p-8 overflow-hidden shadow-lg shadow-blue-900/10">
            {/* Soft Gradient Orbs Background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[64px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/20 blur-[64px] rounded-full"></div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Decorative Icon Right */}
            <ShieldCheck className="absolute -right-6 top-1/2 -translate-y-1/2 w-[160px] h-[160px] text-white/5 rotate-12" strokeWidth={1} />

            <div className="relative z-10">
              <h2 className="text-[22px] font-bold text-white tracking-tight mb-1 leading-tight">
                Stabilitas Pangan
              </h2>
              <p className="text-[12px] text-white/80 leading-relaxed mb-6 font-medium max-w-[220px]">
                Monitoring harga pasar dan layanan pengaduan pangan terpadu di Brebes.
              </p>
              <Link href="/lapor" className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#2143B1] px-6 py-3 rounded-2xl font-bold text-[13px] shadow-sm hover:translate-y-[-2px] active:translate-y-[1px] transition-all duration-300">
                Lapor Sekarang
              </Link>
            </div>
          </div>
        </section>


        {/* Cek Harga Ringkas */}
        <section className="px-5 pt-10 pb-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Cek Harga Ringkas</h3>
            <Link href="/harga" className="flex items-center gap-1 text-[12px] font-semibold text-[#3a5dcf] hover:text-[#2143B1] group px-3 py-1.5 bg-blue-50 rounded-full transition-colors">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin mb-2"></div>
                <span className="text-[11px] text-gray-400 font-medium">Memuat data...</span>
              </div>
            ) : hargaList.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {hargaList.map((item: any) => {
                  const isBeras = item.nama.toLowerCase().includes('beras');
                  const isMinyak = item.nama.toLowerCase().includes('minyak');
                  
                  return (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center 
                        ${isBeras ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 border border-emerald-100/50' : 
                          isMinyak ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-500 border border-amber-100/50' : 
                          'bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-500 border border-blue-100/50'}
                      `}>
                        {isBeras ? <Wheat className="w-5 h-5" strokeWidth={2} /> : 
                         isMinyak ? <Droplets className="w-5 h-5" strokeWidth={2} /> : 
                         <Package className="w-5 h-5" strokeWidth={2} />}
                      </div>
                      <div className="text-[14px] font-semibold text-gray-900">{item.nama}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-bold text-gray-900 tracking-tight">
                        {formatRupiah(item.harga)}<span className="text-[10px] text-gray-400 font-medium ml-0.5">/{item.satuan}</span>
                      </div>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider
                        ${item.status === 'normal' ? 'bg-[#f0fdf4] text-emerald-600 border border-emerald-100' : 'bg-[#fff7ed] text-orange-600 border border-orange-100'}`}>
                        {item.status === 'normal' ? 'HET Stabil' : 'Awasi Harga'}
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl">
                <div className="divide-y divide-gray-50 text-left">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/50 rounded-[14px] flex items-center justify-center text-emerald-600">
                        <Wheat className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="text-[14px] font-semibold text-gray-900">Beras Medium</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-bold text-gray-900 tracking-tight">
                        Rp 10.900<span className="text-[10px] text-gray-400 font-medium ml-0.5">/kg</span>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#f0fdf4] text-emerald-600 border border-emerald-100/60 text-[9px] font-bold uppercase tracking-wider">
                        HET Stabil
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100/50 rounded-[14px] flex items-center justify-center text-amber-500">
                        <Droplets className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="text-[14px] font-semibold text-gray-900">Minyak Goreng Curah</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-bold text-gray-900 tracking-tight">
                        Rp 15.000<span className="text-[10px] text-gray-400 font-medium ml-0.5">/lt</span>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#fff7ed] text-orange-600 border border-orange-100/60 text-[9px] font-bold uppercase tracking-wider">
                        Awasi Harga
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      <BottomNav />
    </>
  );
}
