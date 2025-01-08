'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Determine if it's an admin page to conditionally hide the navbar
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#EEECED]">
        <ClerkProvider
        afterSignInUrl="/redirect-handler"
      afterSignUpUrl="/redirect-handler"
        >
          {!isAdminPage && <Navbar />}
          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
