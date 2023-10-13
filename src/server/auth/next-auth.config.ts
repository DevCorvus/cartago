import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { authService } from '../services';

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
        if (!result.success) throw new Error('Invalid input');

        const loggedUser = await authService.login(result.data);

        if (!loggedUser) throw new Error('Unauthorized');

        return {
          id: loggedUser.id,
          name: loggedUser.fullname,
          role: loggedUser.role,
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
      session.user = token.user!;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
};
