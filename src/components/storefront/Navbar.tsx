"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { getTotals } = useCart();
  const totals = getTotals();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show this navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
          KSL Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/cart" className="relative flex items-center p-2 text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <ShoppingCart className="h-6 w-6" />
            {mounted && totals.totalQuantity > 0 && (
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
