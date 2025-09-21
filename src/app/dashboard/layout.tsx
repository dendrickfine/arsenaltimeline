import React from 'react';
import Link from 'next/link';
import SidebarNav from './SidebarNav';
import SignOutButton from './SignOutButton'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 text-white p-4 flex flex-col"
        style={{ backgroundColor: '#063672' }}
      >
        <div className="text-2xl font-bold mb-8">
          <Link href="/dashboard">Timeline Panel</Link>
        </div>

        {/* Navigasi */}
        <SidebarNav />

        {/* Tombol Sign Out di bawah */}
        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
