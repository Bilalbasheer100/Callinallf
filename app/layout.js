import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'E-Commerce Website',
  description: 'E-commerce site with Next.js App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ClerkProvider>
        {children}
     </ClerkProvider>

      </body>
    </html>
  );
}
