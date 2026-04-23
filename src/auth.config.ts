import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminRoute) {
        if (!isLoggedIn) return false;

        const role = auth?.user?.role as "USER" | "ADMIN" | "OWNER" | undefined;
        return role === "ADMIN" || role === "OWNER";
      }
      return true; // Allow access to all other routes
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as "USER" | "ADMIN" | "OWNER";
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as "USER" | "ADMIN" | "OWNER";
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
