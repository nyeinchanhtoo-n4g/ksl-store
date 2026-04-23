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
        // Only allow logged in users to access /admin
        // Note: Specific Role checking (USER vs ADMIN vs OWNER) will be done inside the pages or advanced middleware
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true; // Allow access to all other routes
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as any;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as any;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
