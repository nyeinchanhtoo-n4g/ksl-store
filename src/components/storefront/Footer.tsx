"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide the footer on admin and authentication pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Copyright &copy; {new Date().getFullYear()} <a href="https://www.h2oleather.com/" target="_blank" rel="noreferrer">H²O LEATHER</a>. All rights reserved.
          <br />
          Develop &amp; Design By{" "}
          <a
            href="mailto:nch.mm.dev@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
          >
            N3R0 (N4G)
          </a>
          <br />
          Contact to Developer : {" "}
          <a
            href="tel:09423000211"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
          >
            Call Me
          </a>
        </p>
      </div>
    </footer>
  );
}
