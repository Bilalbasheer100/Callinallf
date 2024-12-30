'use client';

import { useUser, RedirectToSignIn } from '@clerk/nextjs';

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return <div>Your Orders</div>;
}
