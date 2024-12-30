'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Example: Check if the user has an "admin" role in their metadata
    const isAdmin = user.publicMetadata?.role === 'admin';

    if (isAdmin) {
      router.push('/admin/products'); // Redirect admins to the admin dashboard
    } else {
      router.push('/products'); // Redirect users to the products page
    }
  }, [user, router]);

  return <p>Redirecting...</p>; // Temporary message while redirecting
}
