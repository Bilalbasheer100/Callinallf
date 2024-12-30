'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const { isSignedIn } = useUser(); // Check if the user is signed in

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Cart 🛒', path: '/cart' },
    { name: 'Orders 📄', path: '/orders' },
  ];

  return (
    <header className="bg-[#2D332F] text-gray-200">
      <div className="flex justify-between items-center px-6 py-4 sm:px-20">
        {/* Logo */}
        <h1
          className="text-xl font-bold font-serif sm:text-2xl italic cursor-pointer"
          onClick={() => router.push('/')}
        >
          Callin' All F
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
        <nav className="hidden sm:flex space-x-6 items-center">
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

          {/* Authentication Buttons */}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-[#2D332F] text-gray-200 px-6 py-4">
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

          {/* Authentication Buttons */}
          <div className="mt-4">
            {isSignedIn ? (
              <div>
                <UserButton />
              </div>
            ) : (
              <SignInButton>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
