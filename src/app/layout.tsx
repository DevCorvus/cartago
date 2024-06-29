import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import NavBar from '@/components/ui/NavBar';
import UserProvider, { UserData } from '@/components/providers/UserProvider';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { cartService, wishedItemService } from '@/server/services';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import MobileControls from '@/components/ui/MobileControls';
import 'react-loading-skeleton/dist/skeleton.css';
import Footer from '../components/ui/Footer';

const title = 'Cartago';
const description = 'eCommerce platform demo';

export const metadata: Metadata = {
  title: 'Cartago | Punic eCommerce',
  description,
  keywords: ['ecommerce'],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title,
    description,
    siteName: title,
    images: {
      url: '/preview.png',
    },
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    images: {
      url: '/preview.png',
    },
  },
};

const openSans = Open_Sans({
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  let userData: UserData | null = null;

  if (session) {
    userData = {
      cartItemIds: (await cartService.findAllItemIds(session.user.cartId))!,
      wishedItemIds: (await wishedItemService.findAllIds(session.user.id))!,
    };
  }

  return (
    <html lang="en" className={openSans.className}>
      <body className="relative bg-neutral-100">
        <AuthProvider session={session}>
          <ReactQueryProvider>
            <UserProvider data={userData}>
              <NextTopLoader color="#06B6D4" showSpinner={false} />
              <NavBar />
              <main className="min-h-screen w-full">{children}</main>
              <div id="modal-container" />
              <MobileControls />
              <Footer />
              <Toaster position="bottom-right" />
            </UserProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
