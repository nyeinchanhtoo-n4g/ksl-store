"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "dark" | "light" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "dark",
  setTheme: () => null,
});

const THEME_EVENT = "ksl-theme-change";

function subscribeTheme(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme") callback();
  };
  const onCustom = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onCustom);
  };
}

function getThemeSnapshot(): Theme {
  const t = (localStorage.getItem("theme") as Theme | null) ?? "dark";
  return t === "dark" || t === "light" || t === "system" ? t : "dark";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === "system") {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      localStorage.setItem("theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
