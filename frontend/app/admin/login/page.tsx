'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAdminLogin } from '@/lib/hooks';
import { loginSchema } from '@/lib/schemas';
import { User, Lock, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Brand Header */}
          <div className="flex flex-col items-center px-8 pt-10 pb-7">
            {/* Logo */}
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/img/logo.jpeg"
                alt="Logo SIAP PANGAN"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>

            {/* Brand Text */}
            <h1 className="text-[#1a3399] text-[17px] font-bold tracking-wide leading-none">
              SIAP PANGAN
            </h1>
            <p className="text-gray-400 text-[11px] mt-1 font-medium tracking-widest uppercase">
              Polres Brebes
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-8" />

          {/* Form Section */}
          <div className="px-8 pt-6 pb-8">
            <div className="mb-6">
              <h2 className="text-[15px] font-semibold text-gray-800">Masuk ke Dashboard</h2>
              <p className="text-[13px] text-gray-400 mt-0.5">Khusus petugas yang berwenang</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#1a3399]/40 focus:bg-white transition-all"
                  />
                </div>
                {errors.username && (
                  <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px]">!</span>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#1a3399]/40 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px]">!</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#1a3399] text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#2143B1] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" strokeWidth={2} />
                    Masuk
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-5 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-[11px] mt-5">
          © 2026 SIAP PANGAN Polres Brebes
        </p>

      </div>
    </div>
  );
}
