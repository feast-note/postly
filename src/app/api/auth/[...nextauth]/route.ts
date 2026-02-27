import { addUser } from "@/service/user";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SiLinuxprofessionalinstitute } from "react-icons/si";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user: { email, name, image, id } }) {
      if (!email || !name) return false;
      await addUser({
        id,
        email,
        image: image || "",
        name,
      });
      return true;
    },
    async session({ session, token }) {
      const user = session?.user;

      session.user = {
        ...user,
        id: token.id as string,
      };

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
