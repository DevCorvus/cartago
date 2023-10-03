import NextAuth from 'next-auth';
import { nextAuthOptions } from '@/server/auth/next-auth.config';

const nextAuthHandler = NextAuth(nextAuthOptions);

export { nextAuthHandler as GET, nextAuthHandler as POST };
