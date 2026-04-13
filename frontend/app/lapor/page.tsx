'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import BottomNav from '@/components/BottomNav';
import { useCreateLaporan } from '@/lib/hooks';
import { laporanSchema, KECAMATAN_BREBES } from '@/lib/schemas';
import { saveTicket } from '@/lib/ticket-storage';

export default function LaporPage() {
  const [fotoBukti, setFotoBukti] = useState<File | null>(null);
  const [fotoBukti2, setFotoBukti2] = useState<File | null>(null);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const createLaporan = useCreateLaporan();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      nama: formData.get('nama') as string,
      noHp: formData.get('noHp') as string,
      komoditas: formData.get('komoditas') as string,
      namaToko: formData.get('namaToko') as string,
      alamat: formData.get('alamat') as string,
      kecamatan: formData.get('kecamatan') as string,
      kronologi: formData.get('kronologi') as string,
    };

    // Validate with Zod
    const result = laporanSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await createLaporan.mutateAsync({
        ...result.data,
        fotoBukti: fotoBukti || undefined,
        fotoBukti2: fotoBukti2 || undefined,
      });

      // Simpan tiket ke localStorage
      saveTicket({
        tiket: response.data.tiket,
        komoditas: result.data.komoditas,
        kecamatan: result.data.kecamatan,
        status: 'diterima',
        createdAt: response.data.createdAt,
      });

      setSuccessTicket(response.data.tiket);
      formRef.current?.reset();
      setFotoBukti(null);
      setFotoBukti2(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim laporan');
    }
  };

  // Success screen after submit
  if (successTicket) {
    return (
      <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-16 px-4 flex items-center border-b border-gray-100/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
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
              <h1 className="text-gray-900 text-[15px] font-black tracking-tight leading-tight">SIAP PANGAN</h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Polres Brebes</p>
            </div>
          </Link>
        </div>
      </header>

        <main className="pt-16 pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] flex items-center justify-center bg-gray-50">
          <div className="text-center px-5 py-10 max-w-[400px] w-full">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <i className="fas fa-check text-3xl text-emerald-500"></i>
            </div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-2 tracking-tight">
              Laporan Terkirim
            </h2>
            <p className="text-[13px] text-gray-500 mb-8 leading-relaxed font-medium">
              Simpan nomor tiket ini untuk melacak status laporan Anda melalui menu Status Laporan.
            </p>

            <div className="bg-white rounded-[24px] p-8 mb-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Nomor Tiket</p>
              <p className="text-[32px] font-bold text-primary font-mono tracking-widest relative z-10">
                {successTicket}
              </p>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <i className="fas fa-ticket-alt text-4xl rotate-12"></i>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 text-blue-800 p-4 rounded-2xl text-[12px] text-left mb-8">
              <i className="fas fa-info-circle text-primary mt-0.5"></i>
              <span className="leading-relaxed font-medium text-blue-700">Tiket ini juga telah tersimpan secara otomatis di riwayat laporan pada perangkat Anda.</span>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/cek-laporan" className="flex items-center justify-center gap-2 w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                Cek Status Laporan
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-16 px-4 flex items-center border-b border-gray-100/50">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
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
              <h1 className="text-gray-900 text-[15px] font-black tracking-tight leading-tight">SIAP PANGAN</h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Polres Brebes</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="pt-16 pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-10 min-h-[100dvh] bg-gray-50">
        <div className="bg-gradient-to-br from-primary-dark to-primary px-5 pt-6 pb-12 text-white relative">
          <div className="absolute -bottom-px left-0 right-0 h-6 bg-gray-50 rounded-t-3xl"></div>
          
          <div className="max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white mb-4 transition-colors">
              <i className="fas fa-arrow-left"></i> Kembali
            </Link>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Lapor Pelanggaran</h2>
            <p className="text-sm text-blue-200/90 font-medium">Mohon lengkapi formulir laporan di bawah ini</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 pb-8 max-w-2xl mx-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 md:p-7">
              <div className="space-y-5">
                
                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" name="nama" placeholder="Masukkan nama Anda" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.nama && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.nama}</p>}
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Nomor HP/WA <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" name="noHp" placeholder="08xx-xxxx-xxxx"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.noHp && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.noHp}</p>}
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Komoditas <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" name="komoditas" placeholder="Contoh: Beras, Minyak goreng, Bawang"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.komoditas && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.komoditas}</p>}
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Nama Toko / Distributor <span className="text-gray-400 text-[11px] font-normal">(opsional)</span>
                  </label>
                  <input 
                    type="text" name="namaToko" placeholder="Nama tempat kejadian"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Alamat Lokasi <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="alamat" rows={2} placeholder="Alamat detail lokasi pelanggaran"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px]"
                  ></textarea>
                  {errors.alamat && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.alamat}</p>}
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="kecamatan" defaultValue=""
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="" disabled>Pilih kecamatan</option>
                    {KECAMATAN_BREBES.map((kec) => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
                  {errors.kecamatan && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.kecamatan}</p>}
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Kronologi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="kronologi" rows={4} placeholder="Jelaskan detail kronologi kejadian..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                  ></textarea>
                  {errors.kronologi && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {errors.kronologi}</p>}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Foto Bukti 1 <span className="text-gray-400 text-[11px] font-normal">(opsional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoBukti(e.target.files?.[0] || null)}
                    className="w-full p-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-2 font-medium">Format: JPG, PNG, WebP. Maksimal 5MB</p>
                </div>

                {/* Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Foto Bukti 2 <span className="text-gray-400 text-[11px] font-normal">(opsional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoBukti2(e.target.files?.[0] || null)}
                    className="w-full p-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-2 font-medium">Format: JPG, PNG, WebP. Maksimal 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 text-blue-800 p-5 rounded-2xl text-[12px] leading-relaxed font-medium">
              <i className="fas fa-shield-alt text-primary/70 mt-0.5 px-0.5"></i>
              <span>Data Anda akan dijaga kerahasiaannya. Laporan diproses maksimal 1x24 jam kerja.</span>
            </div>

            <button
              type="submit"
              disabled={createLaporan.isPending}
              className="w-full py-4 px-6 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {createLaporan.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"></i> 
                  Kirim Laporan
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
