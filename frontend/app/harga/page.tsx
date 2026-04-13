'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { useHarga } from '@/lib/hooks';
import { Search, ShieldCheck, Wheat, Droplets, Package, Leaf, Egg, Clock, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: Package },
  { id: 'Kebutuhan Pokok', label: 'Kebutuhan Pokok', icon: Wheat },
  { id: 'Barang Penting', label: 'Barang Penting', icon: Droplets },
  { id: 'Lain - lain', label: 'Lain - lain', icon: Leaf },
];

export default function HargaPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const { data, isLoading } = useHarga(search);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const hargaList = useMemo(() => {
    let list = data?.data || [];
    if (activeCategory !== 'semua') {
      list = list.filter((item: any) => {
        return item.kategori === activeCategory || (activeCategory === 'Kebutuhan Pokok' && !item.kategori);
      });
    }
    return list;
  }, [data, activeCategory]);

  return (
    <>
      {/* Shared header matching home page */}
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
        {/* Title */}
        <div className="px-5 pt-6 pb-2 max-w-2xl mx-auto">
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-0.5">Harga Bahan Pokok</h2>
          <p className="text-[12px] text-gray-400 font-medium">Data acuan harga di Kabupaten Brebes</p>
        </div>

        <div className="px-5 pb-6 max-w-2xl mx-auto">
          {/* Search */}
          <div className="relative mb-5 mt-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2.5} />
            <input
              type="search"
              placeholder="Cari komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/20 transition-all text-gray-900 placeholder:text-gray-400 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            />
          </div>

          {/* Category Pills */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 mb-5 -mx-5 px-5 snap-x">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-full border shrink-0 transition-all duration-300 text-[12px] font-bold
                    ${isActive
                      ? 'bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] border-transparent text-white shadow-sm shadow-blue-600/15'
                      : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.5} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Harga List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
              <span className="text-[12px] font-medium text-gray-400">Memuat data harga...</span>
            </div>
          ) : hargaList.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-[24px] border border-gray-100 shadow-sm">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
              <h3 className="text-[14px] font-bold text-gray-700 mb-1">Tidak ditemukan</h3>
              <p className="text-[12px] text-gray-400 font-medium">Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {hargaList.map((item: any) => {
                const isNormal = item.status === 'normal';
                const isBeras = item.nama.toLowerCase().includes('beras');
                const isMinyak = item.nama.toLowerCase().includes('minyak');

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[20px] p-4 border border-gray-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center border
                          ${isBeras ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                            isMinyak ? 'bg-amber-50 text-amber-500 border-amber-100/50' :
                            'bg-blue-50 text-[#3a5dcf] border-blue-100/50'
                          }`}
                        >
                          {isBeras ? <Wheat className="w-5 h-5" strokeWidth={2} /> :
                           isMinyak ? <Droplets className="w-5 h-5" strokeWidth={2} /> :
                           <Package className="w-5 h-5" strokeWidth={2} />}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-gray-900 leading-tight">{item.nama}</div>
                          <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                            ${isNormal ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                            {isNormal ? '✓ HET Stabil' : '⚠ Awasi'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[11px] font-bold text-gray-400">Rp</span>
                          <span className="text-[20px] font-black tracking-tight text-gray-900 leading-none">
                            {new Intl.NumberFormat('id-ID').format(item.harga)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400">/{item.satuan}</span>
                      </div>
                    </div>

                    {item.updatedAt && (
                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-300" strokeWidth={2.5} />
                        <span className="text-[10px] text-gray-400 font-medium">
                          Update {new Date(item.updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
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
