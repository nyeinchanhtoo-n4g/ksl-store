"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoading() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hideAfterNavigation = setTimeout(() => setIsLoading(false), 0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target.closest("a") : null;
      const href = target?.getAttribute("href");
      if (!target || !href || target.target === "_blank" || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.search === window.location.search)) return;

      setIsLoading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsLoading(false), 8_000);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      clearTimeout(hideAfterNavigation);
      document.removeEventListener("click", handleClick, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-1 overflow-hidden bg-blue-100 dark:bg-blue-950" role="status" aria-label="Loading">
      <div className="h-full w-1/3 animate-[navigation-progress_1s_ease-in-out_infinite] bg-blue-600 dark:bg-blue-400" />
    </div>
  );
}
