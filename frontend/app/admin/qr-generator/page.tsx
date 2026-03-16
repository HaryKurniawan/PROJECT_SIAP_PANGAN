'use client';

import { useState, useRef, useEffect } from 'react';
import { useHarga } from '@/lib/hooks';
import { QrCode, Printer, Download, Search, Package } from 'lucide-react';
import QRCode from 'qrcode';

export default function AdminQRGeneratorPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useHarga(search);
  const hargaList = data?.data || [];
  const [qrUrls, setQrUrls] = useState<Record<number, string>>({});

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const generateQRs = async () => {
      const urls: Record<number, string> = {};
      for (const item of hargaList) {
        try {
          const url = await QRCode.toDataURL(`${siteUrl}/pantau/${item.id}`, {
            width: 256,
            margin: 2,
            color: {
              dark: '#2143B1',
              light: '#FFFFFF',
            },
          });
          urls[item.id] = url;
        } catch (err) {
          console.error('QR generation error:', err);
        }
      }
      setQrUrls(urls);
    };

    if (hargaList.length > 0) {
      generateQRs();
    }
  }, [hargaList, siteUrl]);

  const handlePrint = (itemId: number, itemName: string) => {
    const qrUrl = qrUrls[itemId];
    if (!qrUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${itemName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
            .card { text-align: center; padding: 32px; border: 2px solid #e5e7eb; border-radius: 16px; max-width: 320px; }
            .logo-text { font-size: 14px; font-weight: 800; color: #2143B1; letter-spacing: 1px; margin-bottom: 4px; }
            .subtitle { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
            .qr-img { width: 200px; height: 200px; margin: 0 auto 16px; }
            .product-name { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 6px; }
            .instruction { font-size: 11px; color: #6b7280; line-height: 1.5; }
            .badge { display: inline-block; margin-top: 12px; padding: 4px 12px; background: #eff6ff; color: #2143B1; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            @media print { body { margin: 0; } .card { border: 2px solid #d1d5db; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo-text">SIAP PANGAN</div>
            <div class="subtitle">Kabupaten Brebes</div>
            <img src="${qrUrl}" class="qr-img" alt="QR Code"/>
            <div class="product-name">${itemName}</div>
            <div class="instruction">Scan QR code ini untuk memverifikasi bahwa produk ini berada dalam pengawasan harga.</div>
            <div class="badge">✓ Dalam Pengawasan</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handlePrintAll = () => {
    if (hargaList.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrCards = hargaList.map((item: any) => {
      const qrUrl = qrUrls[item.id];
      if (!qrUrl) return '';
      return `
        <div class="card">
          <div class="logo-text">SIAP PANGAN</div>
          <div class="subtitle">Kabupaten Brebes</div>
          <img src="${qrUrl}" class="qr-img" alt="QR Code"/>
          <div class="product-name">${item.nama}</div>
          <div class="instruction">Scan QR code ini untuk verifikasi pengawasan harga.</div>
          <div class="badge">✓ Dalam Pengawasan</div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Semua Komoditas</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: white; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
            .card { text-align: center; padding: 24px; border: 2px solid #e5e7eb; border-radius: 16px; page-break-inside: avoid; }
            .logo-text { font-size: 12px; font-weight: 800; color: #2143B1; letter-spacing: 1px; margin-bottom: 2px; }
            .subtitle { font-size: 9px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
            .qr-img { width: 160px; height: 160px; margin: 0 auto 12px; }
            .product-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
            .instruction { font-size: 10px; color: #6b7280; line-height: 1.4; }
            .badge { display: inline-block; margin-top: 8px; padding: 3px 10px; background: #eff6ff; color: #2143B1; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            @media print { .grid { grid-template-columns: repeat(2, 1fr); } .card { border: 1.5px solid #d1d5db; } }
          </style>
        </head>
        <body>
          <div class="grid">${qrCards}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">QR Code Generator</h2>
          <p className="text-gray-500 text-sm mt-1">Generate dan cetak QR code untuk pantau harga pangan</p>
        </div>
        <button
          onClick={handlePrintAll}
          disabled={hargaList.length === 0 || Object.keys(qrUrls).length === 0}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" strokeWidth={2.5} />
          Cetak Semua QR
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2.5} />
            <input
              type="search"
              placeholder="Cari komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/10 focus:border-[#3a5dcf]/30 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* QR Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col gap-2 items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400 font-medium">Memuat data komoditas...</span>
        </div>
      ) : hargaList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm font-bold text-gray-500">Tidak ada komoditas</p>
          <p className="text-xs text-gray-400 mt-1">Tambah data harga terlebih dahulu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hargaList.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
              {/* QR Code Display */}
              <div className="p-6 flex flex-col items-center bg-gradient-to-b from-blue-50/30 to-white">
                {qrUrls[item.id] ? (
                  <img
                    src={qrUrls[item.id]}
                    alt={`QR Code ${item.nama}`}
                    className="w-40 h-40 rounded-xl shadow-sm border border-gray-100"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-[#3a5dcf] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 border-t border-gray-50">
                <p className="font-bold text-gray-900 text-sm mb-1 truncate">{item.nama}</p>
                <p className="text-xs text-gray-500 font-medium mb-3">
                  {formatRupiah(item.harga)}<span className="text-gray-400">/{item.satuan}</span>
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint(item.id, item.nama)}
                    disabled={!qrUrls[item.id]}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-lg text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
                  >
                    <Printer className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Cetak
                  </button>
                  <a
                    href={qrUrls[item.id] || '#'}
                    download={`qr-${item.nama.replace(/\s+/g, '-').toLowerCase()}.png`}
                    className={`inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-[#3a5dcf] rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors ${!qrUrls[item.id] ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
