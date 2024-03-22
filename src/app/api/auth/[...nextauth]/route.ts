import { User } from '@/lib/definitions';
import { sql } from '@vercel/postgres';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

async function getUser(email: string): Promise<any | undefined> {
  try {
    // By unique identifier
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, req) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          console.log(password);
          const passwordsMatch = await compare(password, user.password);

          if (!user.active) {
            throw new Error('User not activated');
          }

          if (passwordsMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],

  callbacks: {
    // pass in user id to the token
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') {
        token.img = session.img;
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          img: user.img,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          img: token.img,
        },
      };
    },
  },
});

export { handler as GET, handler as POST };
