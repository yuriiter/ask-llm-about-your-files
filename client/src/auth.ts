import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userRepository } from "./lib/repositories/UserRepository";

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      let userFromDB = await userRepository.findByEmail(user.email);
      if (!userFromDB) {
        userFromDB = await userRepository.create(user.email);
      }

      return true;
    },
    async session({ session, token, user }) {
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
