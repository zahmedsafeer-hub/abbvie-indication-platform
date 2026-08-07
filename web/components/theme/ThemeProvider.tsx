"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("abbvie_theme") as Theme | null;
    const initialTheme = saved || "dark";
    setThemeState(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("abbvie_theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "dark" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`relative rounded-xl border border-slate-700/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 px-2.5 py-1.5 transition-all shadow-sm ${className || ""}`}
      title={theme === "dark" ? "Switch to Clinical Light Mode" : "Switch to Deep Dark Mode"}
    >
      {theme === "dark" ? (
        <span className="flex items-center gap-1.5 text-xs font-mono">
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline text-amber-300 text-[11px]">Light</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-mono">
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline text-indigo-700 text-[11px]">Dark</span>
        </span>
      )}
    </Button>
  );
}
