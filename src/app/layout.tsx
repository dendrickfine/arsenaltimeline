import type { Metadata } from "next";
// 1. Impor next/font/local
import localFont from "next/font/local";
import "./globals.css";
import "./styles/safari-fixes.css";

// 2. Definisikan font lokal Anda
const plusJakarta = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans-Light.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Regular.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap', // Opsi untuk performa
  variable: '--font-plus-jakarta', // Membuat CSS Variable
});


export const metadata: Metadata = {
  title: "Arsenal Timeline | #1 Transfer News Source",
  description: "#1 Your Arsenal Transfer News Source",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Terapkan variabel font ke tag <html>
    <html lang="en" className={`${plusJakarta.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}