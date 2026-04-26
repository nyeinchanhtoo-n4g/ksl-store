"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useCart } from "@/store/useCart";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsClient } from "@/lib/useIsClient";
import { useSession, signOut } from "next-auth/react";

type CollectionLink = {
  id: string;
  name: string;
  slug: string;
};

interface NavbarProps {
  logoUrl?: string | null;
  collections?: CollectionLink[];
}

export default function Navbar({ logoUrl, collections = [] }: NavbarProps) {
  const { data: session, status } = useSession();
  const { getTotals } = useCart();
  const totals = getTotals();
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useIsClient();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const collectionsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        collectionsMenuRef.current &&
        !collectionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsCollectionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show this navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
            {collections.length > 0 && (
              <div className="relative" ref={collectionsMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCollectionsOpen((current) => !current)}
                  className="inline-flex min-w-[128px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <span className="text-center">Collections</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isCollectionsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCollectionsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Collections
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                        Browse by collection
                      </p>
                    </div>
                    <div className="py-2">
                      {collections.map((collection) => (
                        <button
                          key={collection.id}
                          type="button"
                          onClick={() => {
                            setIsCollectionsOpen(false);
                            router.push(`/#collection-${collection.slug}`);
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                        >
                          {collection.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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

      </div>
    </header>
  );
}
