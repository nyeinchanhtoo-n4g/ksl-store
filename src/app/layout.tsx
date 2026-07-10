import type { Metadata } from 'next';
import './globals.css';

import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { auth } from '@/auth';
import Script from 'next/script';

import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 },
  });

  return {
    title: 'H²O LEATHER',
    description: 'Premium leather goods storefront',
    icons: {
      icon: settings?.faviconUrl || '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const [settings, collections] = await Promise.all([
    prisma.storeSettings.findUnique({
      where: { id: 1 },
    }),
    prisma.collection.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
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
            <Navbar logoUrl={settings?.logoUrl} collections={collections} />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
