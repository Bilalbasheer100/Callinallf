'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <SignIn />
    </main>
  );
}
