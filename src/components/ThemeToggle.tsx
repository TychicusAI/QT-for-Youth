"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
  iconSize?: "sm" | "md";
}

export function ThemeToggle({ className, iconSize = "md" }: ThemeToggleProps) {
  const { isDark, mounted, toggleTheme } = useTheme();

  const iconClass = iconSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="切換深淺模式"
      title={mounted ? (isDark ? "切換為淺色模式" : "切換為深色模式") : "切換深淺模式"}
      className={
        className ||
        "p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition cursor-pointer"
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className={`${iconClass} text-amber-400`} />
        ) : (
          <Moon className={`${iconClass} text-stone-600 dark:text-stone-300`} />
        )
      ) : (
        <span className={`${iconClass} block`} />
      )}
    </button>
  );
}
