import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false;
        }
        return true; 
      }
      return true;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        if (token.role) {
          session.user.role = token.role as "USER" | "ADMIN" | "OWNER";
        }
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
