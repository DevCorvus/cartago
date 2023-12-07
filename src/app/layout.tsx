import './globals.css';
import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import AuthProviders from '@/components/providers/AuthProviders';
import NavBar from '@/components/ui/NavBar';

const merriweather = Merriweather({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'eCommerce Next',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={merriweather.className}>
      <body className="bg-neutral-50 relative">
        <AuthProviders>
          <NavBar />
          <main className="w-full min-h-screen">{children}</main>
          <div id="modal-container"></div>
        </AuthProviders>
      </body>
    </html>
  );
}
