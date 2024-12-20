'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const navItems = [
    { name: 'All Products', path: '/admin/products' },
    { name: 'Order Details', path: '/admin/orders' },
    { name: 'All Users', path: '/admin/all-users' },
  ];

  return (
    <header className="bg-[#002512] text-gray-200">
      <div className="flex justify-between items-center px-6 py-4 sm:px-10">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer sm:text-2xl"
          onClick={() => router.push('/admin/products')}
        >
          Admin Dashboard
        </h1>

        {/* Hamburger Menu Toggle for Mobile */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`${
                pathname === item.path
                  ? 'border-b-4 border-gray-300 pb-1'
                  : 'hover:underline'
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-gray-800 text-gray-200 px-6 py-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`${
                pathname === item.path
                  ? 'border-b-4 border-blue-500 pb-1'
                  : ''
              } block w-full text-left py-2 hover:underline`}
              onClick={() => {
                router.push(item.path);
                setIsMenuOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
