'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please sign in to continue to your account
        </p>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl={(session) => {
            const role = session?.user?.publicMetadata?.role;
            return role === 'admin' ? '/admin/products' : '/products';
          }} // Redirect based on user role
          appearance={{
            layout: {
              logoPlacement: 'top',
              socialButtonsPlacement: 'bottom',
              showOptionalFields: false,
            },
            elements: {
              card: 'shadow-lg rounded-lg border border-gray-200',
              formFieldInput: 'rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500',
              formButtonPrimary:
                'bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition',
              formHeaderTitle: 'text-lg font-semibold text-gray-800',
            },
          }}
        />
      </div>
    </div>
  );
}


