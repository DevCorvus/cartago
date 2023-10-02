import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
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
      authorize: async (credentials, _req) => {
        // TODO: Proper auth
        const user: User = { id: '1', email: credentials?.email };
        return user;
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
});

export { handler as GET, handler as POST };
