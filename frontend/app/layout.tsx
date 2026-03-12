import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "SIAP PANGAN BRE উল্লেখযোগ্যBES — Polres Brebes",
  description:
    "Sistem Informasi & Aksi Pengawasan Pangan Berbasis Masyarakat — Polres Brebes. Laporkan pelanggaran pangan, pantau harga, dan lacak status laporan.",
  keywords: "siap pangan, brebes, polri, polres brebes, pelaporan pangan, harga pangan",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1D4ED8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-poppins", poppins.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-[100dvh] pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-0 overflow-x-hidden antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
