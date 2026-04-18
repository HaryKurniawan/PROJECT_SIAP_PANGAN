'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAdminLogin } from '@/lib/hooks';
import { loginSchema } from '@/lib/schemas';
import { ShieldCheck, User, Lock, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await loginMutation.mutateAsync(result.data);
      localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
      toast.success('Login berhasil!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2143B1] via-[#3a5dcf] to-[#4a6bdf] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 blur-[80px] rounded-full"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/15 blur-[80px] rounded-full"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/10 blur-[60px] rounded-full"></div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Decorative Shield Icon */}
      <ShieldCheck className="absolute -right-10 top-1/2 -translate-y-1/2 w-[280px] h-[280px] text-white/[0.03] rotate-12" strokeWidth={0.8} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/30 shadow-2xl shadow-blue-900/30 overflow-hidden">
            <Image 
              src="/img/logo.jpeg" 
              alt="Logo SIAP PANGAN" 
              width={80}
              height={80}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight uppercase">SIAP PANGAN</h1>
          <p className="text-white/70 text-sm mt-1.5 font-bold uppercase tracking-widest leading-none">Brebes</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-blue-900/20 p-8 border border-white/50">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Masuk ke Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Khusus petugas yang berwenang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" strokeWidth={2} />
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/20 focus:border-[#3a5dcf]/40 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
              {errors.username && (
                <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px]">!</span>
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Masukkan password"
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#3a5dcf]/20 focus:border-[#3a5dcf]/40 transition-all text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px]">!</span>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" strokeWidth={2.5} />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#3a5dcf] font-semibold hover:text-[#2143B1] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6 font-medium">© 2026 SIAP PANGAN Polres Brebes</p>
      </div>
    </div>
  );
}
