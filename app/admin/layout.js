'use client';
import AdminNavbar from '@/components/AdminNavbar/page';
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'

export default function AdminLayout({ children }) {

  return <>
  {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
          <AdminNavbar/>
  {children}
  </>;
}
