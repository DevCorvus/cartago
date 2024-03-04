import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { authService, cartService } from '../services';
import { UserSession } from './auth.types';

declare module 'next-auth' {
  interface Session {
    user: UserSession;
  }
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, _req) {
        const result = await loginUserSchema.safeParseAsync(credentials);
        if (!result.success) return null;

        const loggedUser = await authService.login(result.data);

        if (!loggedUser) return null;

        const cartId = await cartService.findUserCartId(loggedUser.id);

        return {
          id: loggedUser.id,
          name: loggedUser.fullname,
          role: loggedUser.role,
          cartId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) token.user = user;
      return token;
    },
    async session({ token, session }) {
      session.user = token.user as UserSession;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
};
