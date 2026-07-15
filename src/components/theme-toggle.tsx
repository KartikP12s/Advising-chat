"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem("cg-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = stored === "dark" || stored === "light" ? stored : preferred;
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggle = () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("cg-theme", nextTheme);
  };

  return (
    <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label="Toggle color theme">
      <Moon className="theme-icon-light" size={17} />
      <Sun className="theme-icon-dark" size={17} />
    </button>
  );
}
