"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/store/useCart";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsClient } from "@/lib/useIsClient";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const { data: session, status } = useSession();
  const { getTotals } = useCart();
  const totals = getTotals();
  const pathname = usePathname();
  const isClient = useIsClient();

  // Don't show this navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Store Logo"
              className="h-8 w-auto sm:h-10 object-contain"
            />
          ) : (
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
              H²O LEATHER
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          {isClient && status === "authenticated" && session && (
            <div className="flex items-center gap-2 sm:gap-4">
              {(session.user?.role === "ADMIN" || session.user?.role === "OWNER") && (
                <Link 
                  href="/admin" 
                  className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}

          {isClient && status === "unauthenticated" && (
            <Link 
              href="/login" 
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              title="Sign In"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {isClient && status === "loading" && (
            <div className="w-9 h-9 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          <Link href="/cart" className="relative flex items-center p-2 text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <ShoppingCart className="h-6 w-6" />
            {isClient && totals.totalQuantity > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {totals.totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
