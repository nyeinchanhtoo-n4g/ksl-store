"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  Home,
  Layers3,
  Phone,
} from "lucide-react";
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
  const contactEmail = "leatherh2o@gmail.com";
  const contactPhone = "+95 99 4700 4600";
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCollectionsOpen(false);
    setIsMobileContactOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  // Don't show this navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      id="top"
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-colors md:bg-white/80 md:backdrop-blur-lg md:dark:bg-zinc-950/80"
    >
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-zinc-950 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-800">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Store Logo"
                width={160}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-500">
                H²O LEATHER
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <Link
            href="/#top"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-gray-900 transition hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-zinc-900 dark:hover:text-blue-400"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsMobileCollectionsOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-gray-900 transition hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-zinc-900 dark:hover:text-blue-400"
            >
              <span className="flex items-center gap-3">
                <Layers3 className="h-5 w-5" />
                Collections
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${isMobileCollectionsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMobileCollectionsOpen && (
              <div className="mt-1 space-y-1 rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
                <Link
                  href="/#products"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                >
                  Shop By Collection
                </Link>
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      router.push(`/#collection-${collection.slug}`);
                    }}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsMobileContactOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-gray-900 transition hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-zinc-900 dark:hover:text-blue-400"
            >
              <span className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                Contact Us
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${isMobileContactOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMobileContactOpen && (
              <div className="mt-1 space-y-1 rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
                <Link
                  href={`mailto:${contactEmail}`}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                >
                  {contactEmail}
                </Link>
                <Link
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                >
                  {contactPhone}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="relative flex h-16 items-center">
            <div className="flex flex-1 items-center justify-start gap-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="hidden md:flex items-center gap-2">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Store Logo"
                    width={200}
                    height={40}
                    className="h-8 w-auto sm:h-10 object-contain"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                    H²O LEATHER
                  </span>
                )}
              </Link>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Store Logo"
                    width={160}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-500">
                    H²O LEATHER
                  </span>
                )}
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
              <ThemeToggle />

              {collections.length > 0 && (
                <div className="relative hidden md:block" ref={desktopMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsDesktopMenuOpen((v) => !v)}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  {isDesktopMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Menu
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                          Browse collections
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/#top"
                          onClick={() => setIsDesktopMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-gray-900 transition hover:bg-blue-50 hover:text-blue-700 dark:text-white dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                        >
                          <Home className="h-4 w-4" />
                          Home
                        </Link>

                        {collections.map((collection) => (
                          <button
                            key={collection.id}
                            type="button"
                            onClick={() => {
                              setIsDesktopMenuOpen(false);
                              router.push(`/#collection-${collection.slug}`);
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
                          >
                            {collection.name}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 px-4 py-3 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                          Contact Info
                        </p>
                        <div className="mt-2 flex flex-col gap-1.5">
                          <Link
                            href={`mailto:${contactEmail}`}
                            onClick={() => setIsDesktopMenuOpen(false)}
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400"
                          >
                            {contactEmail}
                          </Link>
                          <Link
                            href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                            onClick={() => setIsDesktopMenuOpen(false)}
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400"
                          >
                            {contactPhone}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              {isClient && status === "loading" && (
                <div className="w-9 h-9 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              <Link
                href="/cart"
                className="relative flex items-center p-2 text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
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

      </div>
    </header>
  );
}
