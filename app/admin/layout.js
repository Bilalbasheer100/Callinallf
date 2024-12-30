'use client';

import AdminNavbar from '@/components/AdminNavbar';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/nextjs';

export default function AdminLayout({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Ensure the user is authenticated and has the admin role
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || user?.publicMetadata?.role !== 'admin') {
    // Redirect to sign-in if not an admin or not signed in
    return <RedirectToSignIn />;
  }

  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
      </SignedIn>
    </ClerkProvider>
  );
}
