import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '../user/user.service';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { passwordService } from '../password/password.service';

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

        const data = result.data;

        const user = await userService.findByEmail(data.email);

        if (!user) throw new Error('User not found');

        const passwordsMatch = await passwordService.compare(
          data.password,
          user.password,
        );

        if (!passwordsMatch) throw new Error('Unauthorized');

        return {
          id: user.id,
          name: user.fullname,
          role: user.role,
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
