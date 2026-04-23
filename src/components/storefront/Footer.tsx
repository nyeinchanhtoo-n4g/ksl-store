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
          &copy; {new Date().getFullYear()} KSL Store. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
