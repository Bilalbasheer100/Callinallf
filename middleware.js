import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware({
  publicRoutes: [
    '/', // Home page
    '/products', // Products page (public but restricted Add to Cart)
    '/clothes', // Clothes page
    '/skincare', // Skincare page
    '/fragrances', // Fragrances page
    '/sign-in(.*)', // Sign-in page and potential subpaths
    '/sign-up(.*)', // Sign-up page and potential subpaths
  ],
  secretKey: process.env.CLERK_SECRET_KEY, // Ensure this is defined in your environment
});

// Middleware for role-based access control
export async function roleBasedMiddleware(req) {
  const { user } = getAuth(req);
  const url = req.nextUrl.pathname;

  // Role-based access control for admin routes
  if (url.startsWith('/admin')) {
    const role = user?.publicMetadata?.role;

    if (!user || role !== 'admin') {
      // Redirect non-admin users or unauthenticated requests to the home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Add custom logic for other protected routes
  if (url.startsWith('/cart') || url.startsWith('/orders') || url.startsWith('/checkout')) {
    if (!user) {
      // Redirect unauthenticated users to the sign-in page
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // Restrict Add to Cart API to signed-in users only
  if (url.startsWith('/api/cart')) {
    if (!user) {
      // Restrict Add to Cart API to signed-in users only
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Exporting the combined middleware for Clerk and role-based checks
export const combinedMiddleware = async (req) => {
  const clerkResponse = await clerkMiddleware(req);
  if (clerkResponse) return clerkResponse;

  return roleBasedMiddleware(req);
};

export const config = {
  matcher: [
    '/admin/:path*', // Protect all admin routes
    '/api/:path*', // Protect all API routes
    '/cart', // Protect the cart page
    '/orders', // Protect the orders page
    '/checkout', // Protect the checkout page
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', // All other dynamic routes
  ],
};
