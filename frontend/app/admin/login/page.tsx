'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminLogin } from '@/lib/hooks';
import { loginSchema } from '@/lib/schemas';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // JWT disimpan otomatis di HTTP-only cookie oleh backend
      // Simpan info admin (bukan token) di localStorage untuk display name
      localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
      toast.success('Login berhasil!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <i className="fas fa-shield-halved text-white text-2xl"></i>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-blue-300/70 text-sm mt-1">SIAP PANGAN — Polres Brebes</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Masuk ke Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Khusus petugas yang berwenang</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username <span className="required">*</span></label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" name="username" placeholder="Masukkan username" className="pl-10" />
              </div>
              {errors.username && <p className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.username}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="password" name="password" placeholder="Masukkan password" className="pl-10" />
              </div>
              {errors.password && <p className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mt-2"
              style={{ padding: '14px 24px' }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Memproses...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Login</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 font-medium hover:underline">
              <i className="fas fa-arrow-left mr-1"></i> Kembali ke Beranda
            </Link>
          </div>
        </div>

        <p className="text-center text-blue-300/50 text-xs mt-6">© 2026 SIAP PANGAN Polres Brebes</p>
      </div>
    </div>
  );
}
