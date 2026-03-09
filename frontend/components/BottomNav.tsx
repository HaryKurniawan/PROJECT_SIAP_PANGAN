'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertTriangle, Search } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on admin pages and /harga page
  if (pathname.startsWith('/admin') || pathname.startsWith('/harga')) {
    return null;
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Beranda' },
    { href: '/lapor', icon: AlertTriangle, label: 'Lapor' },
    { href: '/cek-laporan', icon: Search, label: 'Status' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-[env(safe-area-inset-bottom,0px)] z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="max-w-md mx-auto h-[72px] flex items-center justify-around relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
              <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-[72px] h-full group touch-manipulation pb-1"
            >
              <div className={`relative flex items-center justify-center`}>
                <Icon strokeWidth={isActive ? 2.5 : 2} className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-gray-900 scale-110' : 'text-gray-400 group-hover:text-gray-600'}`} />
              </div>
              
              <span className={`text-[9px] font-semibold mt-1 transition-all duration-300 ${isActive ? 'text-gray-900 opacity-100' : 'text-gray-400 opacity-80 group-hover:text-gray-600'}`}>
                {item.label}
              </span>
              
              {/* Minimalist Active Indicator Line */}
              {isActive && (
                <span className="absolute -bottom-[2px] w-6 h-[2.5px] bg-gray-900 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
