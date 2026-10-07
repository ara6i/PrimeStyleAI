"use client";
import { Moon, Sun } from "lucide-react";
import { useAdminDashboardTheme } from "@/app/admin/(protected)/hooks/useAdminDashboardTheme";
export function PreviewThemeToggle() {
  const { theme, toggleTheme } = useAdminDashboardTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2"
      aria-label="Toggle calendar theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} Theme
    </button>
  );
}
