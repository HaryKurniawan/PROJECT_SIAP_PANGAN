'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-[64px] px-6 flex items-center border-b border-gray-50/50">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <div className="relative h-10 w-auto flex items-center justify-center">
            <Image 
              src="/img/logo.jpeg" 
              alt="Logo SIAP PANGAN" 
              width={48}
              height={48}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-900 text-[14px] font-semibold tracking-tight leading-none">SIAP PANGAN</span>
            <span className="text-gray-400 text-[10px] font-medium tracking-wide leading-none">Brebes</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
