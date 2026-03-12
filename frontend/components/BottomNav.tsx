'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertTriangle, Search, TrendingUp, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on admin pages and lapor page
  if (pathname.startsWith('/admin') || pathname === '/lapor') {
    return null;
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Beranda' },
    { href: '/harga', icon: TrendingUp, label: 'Harga' },
    { href: '/lapor', icon: AlertTriangle, label: 'Lapor', isCenter: true },
    { href: '/edukasi', icon: Info, label: 'Edukasi' },
    { href: '/cek-laporan', icon: Search, label: 'Status' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Aesthetic Bottom Blur Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-white/20 backdrop-blur-lg pointer-events-none [mask-image:linear-gradient(to_top,black,transparent)]" />
      
      <div className="max-w-lg mx-auto relative pointer-events-auto px-4 pb-6 pt-2">
        {/* Main Navbar Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[24px] h-[68px] flex items-center justify-around px-2 relative overflow-visible">
          
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            if (item.isCenter) {
              return (
                <div key={item.href} className="relative w-14 h-full flex justify-center items-center">
                  <Link
                    href={item.href}
                    className="absolute -top-6 flex flex-col items-center justify-center group"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isActive ? 'bg-primary scale-105 shadow-primary/20' : 'bg-gradient-to-br from-blue-400 to-blue-500 hover:scale-105 shadow-blue-400/20'}`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <span className={`text-[10px] font-medium mt-1.5 transition-all duration-300 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full group py-1"
              >
                <div className="relative flex items-center justify-center mb-1">
                  <Icon 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} 
                  />
                </div>
                <span className={`text-[10px] font-medium transition-all duration-300 tracking-tight ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
