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

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'eCommerce Next',
  description: 'Generated by create next app',
};

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
      <body className="relative bg-neutral-50">
        <AuthProvider session={session}>
          <ReactQueryProvider>
            <UserProvider data={userData}>
              <NextTopLoader color="#86EFAC" showSpinner={false} />
              <NavBar />
              <main className="min-h-screen w-full bg-neutral-50">
                {children}
              </main>
              <div id="modal-container"></div>
              <Toaster position="bottom-right" />
            </UserProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
