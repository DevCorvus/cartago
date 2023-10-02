import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProviders from './AuthProviders';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={inter.className}>
        <AuthProviders>
          <main className="w-screen h-screen">{children}</main>
        </AuthProviders>
      </body>
    </html>
  );
}
