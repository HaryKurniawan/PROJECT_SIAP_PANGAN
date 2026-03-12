'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useHarga } from '@/lib/hooks';
import { Search, Info, Clock, ShieldCheck, Wheat, Droplets, Package, Leaf, Egg } from 'lucide-react';

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-[64px] px-6 flex items-center border-b border-gray-50/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center text-primary bg-primary/5 rounded-xl">
              <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 text-[15px] font-bold tracking-tight leading-none mb-0.5">SIAP PANGAN</span>
              <span className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Kabupaten Brebes</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-white">
        <div className="px-5 pt-6 pb-2 relative">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-0.5">Harga Bahan Pokok</h2>
            <p className="text-[11px] text-gray-400 font-medium">Data diperbarui secara berkala</p>
          </div>
        </div>

        <div className="px-5 pb-6 max-w-2xl mx-auto">
          {/* Compact Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2.5} />
            <input
              type="search"
              placeholder="Cari komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Clean Icon Categories */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 mb-4 -mx-5 px-5 snap-x">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`snap-start flex flex-col items-center justify-center min-w-[68px] h-[68px] rounded-[20px] border shrink-0 transition-all duration-300
                    ${isActive 
                      ? 'bg-primary border-primary text-white shadow-sm' 
                      : 'bg-white border-gray-100/80 text-gray-400 hover:bg-gray-50'}`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.5} />
                  <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Minimalist Info */}
          <div className="flex items-center gap-2 text-gray-400 mb-6 border-b border-gray-50 pb-4">
            <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-[10px] font-medium italic lowercase tracking-tight">Harga acuan di Kabupaten Brebes dipantau berkala</span>
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

      <BottomNav />
    </>
  );
}
