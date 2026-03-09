'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHarga } from '@/lib/hooks';
import { Search, Info, Clock, ChevronLeft, Wheat, Droplets, Package, Leaf, Egg } from 'lucide-react';

const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: Package },
  { id: 'beras', label: 'Beras & Biji', icon: Wheat },
  { id: 'minyak', label: 'Minyak', icon: Droplets },
  { id: 'sayur', label: 'Sayur', icon: Leaf },
  { id: 'protein', label: 'Protein', icon: Egg },
];

export default function HargaPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const { data, isLoading } = useHarga(search);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const hargaList = useMemo(() => {
    let list = data?.data || [];
    if (activeCategory !== 'semua') {
      list = list.filter((item: any) => {
        const name = item.nama.toLowerCase();
        if (activeCategory === 'beras') return name.includes('beras') || name.includes('kedelai') || name.includes('gandum');
        if (activeCategory === 'minyak') return name.includes('minyak');
        if (activeCategory === 'sayur') return name.includes('bawang') || name.includes('cabai') || name.includes('sayur');
        if (activeCategory === 'protein') return name.includes('daging') || name.includes('ayam') || name.includes('telur');
        return true;
      });
    }
    return list;
  }, [data, activeCategory]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-primary-dark to-primary shadow-lg h-16 px-4 flex items-center">
        <div className="max-w-6xl w-full mx-auto flex items-center gap-3">
          <Link href="/" className="w-10 h-10 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-[14px] flex items-center justify-center text-white">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </Link>
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
            <h2 className="text-2xl font-bold tracking-tight mb-1">Harga Bahan Pokok</h2>
            <p className="text-sm text-blue-200/90">Data diperbarui oleh petugas</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 pb-8 max-w-2xl mx-auto">
          {/* Search */}
          <div className="relative mb-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" strokeWidth={2} />
            <input
              type="search"
              placeholder="Cari komoditas... (beras, cabai, dll)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100/80 rounded-[18px] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 mb-4 -mx-5 px-5 snap-x">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`snap-start flex flex-col items-center justify-center min-w-[72px] h-[72px] rounded-[18px] border shrink-0 transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 translate-y-[-2px]' 
                      : 'bg-white border-gray-100/80 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Icon className={`w-6 h-6 mb-1.5 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 text-blue-800 p-4 rounded-[18px] text-[13px] leading-relaxed mb-6">
            <Info className="text-blue-500 mt-0.5 shrink-0 w-4 h-4" strokeWidth={2.5} />
            <span className="font-medium opacity-90">Harga yang ditampilkan adalah harga wajar acuan di Kabupaten Brebes.</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-500">Memuat data harga...</span>
            </div>
          ) : hargaList.length === 0 ? (
            <div className="text-center p-10">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-base font-bold text-gray-800 mb-1">Tidak ditemukan</h3>
              <p className="text-sm text-gray-500">Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {hargaList.map((item: any) => {
                const isNormal = item.status === 'normal';
                
                return (
                <div
                  key={item.id}
                  className="bg-white rounded-[20px] p-5 border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isNormal ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                  
                  <div className="flex justify-between items-start ml-2">
                    <div>
                      <div className="text-[14px] font-bold text-gray-800 mb-1 leading-tight">{item.nama}</div>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-[12px] font-bold text-gray-400">Rp</span>
                        <span className="text-[24px] font-black tracking-tight text-gray-900 leading-none">
                          {new Intl.NumberFormat('id-ID').format(item.harga)}
                        </span>
                        <span className="text-[12px] font-medium text-gray-400">/{item.satuan}</span>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${isNormal ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {isNormal ? 'Stabil' : 'Tinggi'}
                    </span>
                  </div>
                  
                  {item.updatedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between ml-2">
                      <p className="text-[10px] text-gray-400 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                        <Clock className="w-3 h-3" strokeWidth={2.5} />
                        Update {new Date(item.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </>
  );
}
