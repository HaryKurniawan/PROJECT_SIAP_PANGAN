'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ShieldCheck, LayoutDashboard, FileText, Tags, Newspaper, ExternalLink, LogOut, Menu, X, UserCircle, QrCode } from 'lucide-react';

const sidebarLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/laporan', icon: FileText, label: 'Laporan' },
  { href: '/admin/harga', icon: Tags, label: 'Harga Pangan' },
  { href: '/admin/artikel', icon: Newspaper, label: 'Artikel Edukasi' },
  // { href: '/admin/qr-generator', icon: QrCode, label: 'QR Generator' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    const checkAuth = async () => {
      try {
        const res = await api.get('/admin/me');
        setAdminName(res.data?.data?.nama || 'Admin');
        setIsReady(true);
      } catch {
        localStorage.removeItem('admin_data');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch {
      // Even if logout API fails, clear local data
    }
    localStorage.removeItem('admin_data');
    router.push('/admin/login');
  };

  // Skip layout for login page — AFTER all hooks
  if (isLoginPage) return <>{children}</>;

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3a5dcf] rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500">Memvalidasi sesi...</span>
      </div>
    );
  }

  return (
    <>
      {/* Admin Header — Full White Theme */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 backdrop-blur-md h-16 flex items-center px-4" style={{ zIndex: 110 }}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-[#2143B1] hover:bg-blue-50 text-lg p-2 focus:outline-none rounded-xl transition-all"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2143B1] to-[#3a5dcf] rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 border border-white/20">
                <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-[#1a1c21] text-[15px] font-black tracking-tight leading-tight">SIAP PANGAN</h1>
                <p className="text-[#3a5dcf] text-[10px] font-bold tracking-widest uppercase opacity-80">Kabupaten Brebes</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 border border-gray-100 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                <UserCircle className="w-4 h-4 text-[#3a5dcf]" strokeWidth={2.5} />
              </div>
              <span className="text-gray-700 text-[13px] font-bold">{adminName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all border border-transparent hover:border-red-100 group"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar — Light/White */}
      <aside className={`w-[260px] bg-white border-r border-gray-100 h-screen fixed left-0 top-0 pt-20 pb-6 flex flex-col z-[100] transition-transform duration-300 shadow-xl shadow-gray-200/50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-5 py-2 mb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2">Menu Utama</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group
                  ${isActive
                    ? 'bg-gradient-to-r from-[#2143B1] to-[#3a5dcf] text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-500 hover:bg-blue-50/50 hover:text-[#2143B1]'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#3a5dcf] group-hover:scale-110'}`} strokeWidth={2} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-5 border-t border-gray-100 pt-6">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 hover:bg-blue-50 text-[#3a5dcf] hover:text-[#2143B1] rounded-xl text-sm font-bold transition-colors border border-blue-100/50">
            <ExternalLink className="w-4 h-4" strokeWidth={2} />
            Ke Halaman Publik
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
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
