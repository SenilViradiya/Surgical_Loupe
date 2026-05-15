import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";

import { prisma } from "@/lib/prisma";

import { UserRole } from "@/lib/generated/prisma";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email:
                credentials.email as string,
            },
          });

        if (!user || !user.password) {
          return null;
        }

        const isValid =
          await bcrypt.compare(
            credentials.password as string,
            user.password
          );

        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role =
          (token.role as UserRole) ??
          UserRole.USER;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});