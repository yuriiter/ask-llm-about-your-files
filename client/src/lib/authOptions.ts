// import { PrismaClient } from '@prisma/client'; // Import your database client (Prisma, in this case)
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

// const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // const { email, name, image } = user;
      //
      // // Check if user already exists in the database
      // const existingUser = await prisma.user.findUnique({
      //   where: { email },
      // });
      //
      // // If user does not exist, create a new one
      // if (!existingUser) {
      //   await prisma.user.create({
      //     data: {
      //       email: email as string,
      //       name: name as string,
      //       image: image as string,
      //     },
      //   });
      // }

      // Allow sign-in to proceed
      return true;
    },
    async session({ session, token, user }) {
      // Optionally, add user ID to session object
      // const dbUser = await prisma.user.findUnique({
      //   where: { email: session.user?.email || undefined },
      // });
      //
      // if (dbUser) {
      //   session.user.id = dbUser.id; // Add user ID to the session object
      // }

      return session;
    },
  },
};
