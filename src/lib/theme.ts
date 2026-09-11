import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "qtyouth_theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("theme");
    if (val === "dark" || val === "light") {
      return val;
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

export function getCurrentTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = getStoredTheme();
  if (stored) return stored;

  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  return getSystemTheme();
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.dispatchEvent(new Event("qt_theme_updated"));
  } catch {
    // Ignore localStorage errors
  }
}

export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("qt_theme_updated", callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY || e.key === "theme") {
      if (e.newValue === "dark") {
        document.documentElement.classList.add("dark");
      } else if (e.newValue === "light") {
        document.documentElement.classList.remove("dark");
      }
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    if (!getStoredTheme()) {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      callback();
    }
  };
  mediaQuery.addEventListener("change", handleMediaChange);

  return () => {
    window.removeEventListener("qt_theme_updated", callback);
    window.removeEventListener("storage", handleStorage);
    mediaQuery.removeEventListener("change", handleMediaChange);
  };
}

const emptySubscribe = () => () => {};

export function useTheme() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getCurrentTheme,
    () => "light" as Theme
  );

  return {
    theme,
    isDark: mounted && theme === "dark",
    mounted,
    toggleTheme,
    setTheme
  };
}
