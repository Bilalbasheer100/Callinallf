'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function RedirectHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // Extract role from user metadata
        const role = user.publicMetadata?.role || 'user'; // Default role is 'user'
        console.log('Redirecting based on role:', role); // Debugging

        // Redirect based on role
        if (role === 'admin') {
          router.replace('/admin/products');
        } else {
          router.replace('/');
        }
      } else {
        // If no user is loaded, redirect to sign-in
        console.warn('No user found. Redirecting to /sign-in.');
        router.replace('/sign-in');
      }
    }
  }, [isLoaded, user, router]);

  return <div>Redirecting...</div>;
}
