'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { CheckCircle, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function PantauPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get('/harga');
        const allHarga = res.data?.data || [];
        const found = allHarga.find((item: any) => String(item.id) === String(id));
        setProduct(found || null);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500 mt-3">Memuat data...</span>
      </div>
    );
  }

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-br from-[#2143B1]/5 via-[#3a5dcf]/5 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3a5dcf]/5 blur-[60px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/5 blur-[60px] rounded-full"></div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100 overflow-hidden">
            <Image 
              src="/img/logo.jpeg" 
              alt="Logo SIAP PANGAN" 
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-0.5">SIAP PANGAN</p>
            <p className="text-[9px] font-bold text-[#3a5dcf] tracking-widest uppercase opacity-80">Kabupaten Brebes</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 tracking-tight text-center mb-3 leading-tight">
          Produk Dalam Pengawasan
        </h1>

        {/* Checkmark */}
        <div className="relative mb-6">
          <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 bg-emerald-100/50 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="w-16 h-16 text-emerald-500 relative z-10" strokeWidth={2} />
          </div>
        </div>

        {/* Product Name */}
        {product && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-4 text-center min-w-[240px]">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Komoditas</p>
            <p className="text-[18px] font-bold text-gray-900 tracking-tight">{product.nama}</p>
            <p className="text-[14px] font-bold text-[#3a5dcf] mt-1">
              {formatRupiah(product.harga)}
              <span className="text-[11px] text-gray-400 font-medium ml-0.5">/{product.satuan}</span>
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${product.status === 'normal'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                {product.status === 'normal' ? '✓ HET Stabil' : '⚠ Awasi Harga'}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="max-w-[320px] text-center mb-8">
          <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
            {product
              ? 'Produk ini telah berada dalam pengawasan harga oleh SIAP PANGAN Polres Brebes. Harga yang tertera merupakan harga acuan yang dipantau secara berkala.'
              : 'Produk yang Anda cari tidak ditemukan dalam daftar pengawasan. Silakan cek daftar harga untuk informasi terbaru.'
            }
          </p>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-100 px-4 py-2.5 rounded-full mb-8">
          <ShieldCheck className="w-4 h-4 text-[#3a5dcf]" strokeWidth={2.5} />
          <span className="text-[11px] font-bold text-[#3a5dcf] uppercase tracking-wider">Terverifikasi SIAP PANGAN</span>
        </div>

        {/* CTA Button */}
        <Link
          href="/harga"
          className="w-full max-w-[320px] py-4 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
        >
          <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
          Lihat Daftar Harga
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center py-6 relative z-10">
        <p className="text-[11px] text-gray-400 font-medium">© 2026 SIAP PANGAN — Polres Brebes</p>
      </div>
    </div>
  );
}
