'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaNewspaper,
  FaTags,
  FaVideo,
  FaImage,
  FaBullhorn,
  FaHandshake,
  FaUsers
} from 'react-icons/fa';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { href: '/dashboard/artikel', label: 'Articles', icon: <FaNewspaper /> },
  { href: '/dashboard/kategori', label: 'Categories', icon: <FaTags /> },
  { href: '/dashboard/video', label: 'Videos', icon: <FaVideo /> },
  { href: '/dashboard/banner', label: 'Banners', icon: <FaImage /> },
  { href: '/dashboard/iklan', label: 'Ads', icon: <FaBullhorn /> },
  { href: '/dashboard/sponsor', label: 'Sponsors', icon: <FaHandshake /> },
  { href: '/dashboard/users', label: 'Users', icon: <FaUsers /> },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium webkit-transition-fix ${
              isActive
                ? 'font-semibold text-white bg-[#6A7AB5]'
                : 'hover:bg-[#034694] hover:text-white'
            }`}
            style={{
              WebkitTransition: 'all 0.3s ease',
              transition: 'all 0.3s ease',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
