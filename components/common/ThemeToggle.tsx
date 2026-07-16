"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-border/40 bg-white/40 dark:bg-card/45" />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 rounded-xl border border-border/40 bg-white/40 hover:bg-secondary/60 dark:bg-card/45 dark:hover:bg-accent/40 text-foreground transition-all duration-300 active:scale-95 shrink-0 flex items-center justify-center relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="h-[18px] w-[18px] transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-amber-500 shrink-0" />
      <Moon className="absolute h-[18px] w-[18px] transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-primary-foreground/90 dark:text-sky-300 shrink-0" />
    </Button>
  );
}
