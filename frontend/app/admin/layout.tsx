'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const sidebarLinks = [
  { href: '/admin/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
  { href: '/admin/laporan', icon: 'fa-file-alt', label: 'Laporan' },
  { href: '/admin/harga', icon: 'fa-tags', label: 'Harga Pangan' },
  { href: '/admin/artikel', icon: 'fa-newspaper', label: 'Artikel Edukasi' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Skip layout for login page
  if (pathname === '/admin/login') return <>{children}</>;

  useEffect(() => {
    // Validasi sesi admin dengan memanggil /me (cookie terkirim otomatis)
    const checkAuth = async () => {
      try {
        const res = await api.get('/admin/me');
        setAdminName(res.data?.data?.nama || 'Admin');
        setIsReady(true);
      } catch {
        // Cookie expired atau invalid → redirect ke login
        localStorage.removeItem('admin_data');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch {
      // Even if logout API fails, clear local data
    }
    localStorage.removeItem('admin_data');
    router.push('/admin/login');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500">Memvalidasi sesi...</span>
      </div>
    );
  }

  return (
    <>
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-md h-16 flex items-center px-4" style={{ zIndex: 110 }}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-white/80 hover:text-white text-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary-light text-base border border-primary/30"><i className="fas fa-shield-halved"></i></div>
              <div className="hidden sm:block">
                <h1 className="text-white text-[15px] font-bold tracking-tight leading-tight">SIAP PANGAN</h1>
                <p className="text-gray-400 text-[10px] font-semibold tracking-wider uppercase">Panel Admin</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm hidden sm:flex items-center gap-2 font-medium bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <i className="fas fa-user-circle text-primary-light text-lg"></i> {adminName}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 text-sm flex items-center gap-2 transition-all px-3 py-1.5 rounded-lg border border-transparent font-medium"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`w-[260px] bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 pt-20 pb-6 flex flex-col z-[100] transition-transform duration-300 shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-5 py-2 mb-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-2">Menu Utama</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group
                  ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fas ${link.icon} w-5 text-center text-lg transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}></i>
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-8 px-5 border-t border-gray-800 pt-6">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-bold transition-colors">
            <i className="fas fa-external-link-alt"></i>
            Ke Halaman Publik
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="md:ml-[260px] pt-16 min-h-screen bg-gray-50/50">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
