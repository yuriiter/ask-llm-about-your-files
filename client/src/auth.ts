import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const config = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Your existing signIn callback logic
      return true;
    },
    async session({ session, token, user }) {
      // Your existing session callback logic
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
