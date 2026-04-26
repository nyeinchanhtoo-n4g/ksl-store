import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { auth } from "@/auth";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "H²O LEATHER",
  description: "Premium leather goods storefront",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-checker" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.theme === 'light') {
                document.documentElement.classList.remove('dark')
              } else {
                document.documentElement.classList.add('dark')
              }
            } catch (_) {}
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-white">
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">
               {children}
            </div>
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
