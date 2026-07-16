"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Announcements", href: "/announcements" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-white/75 dark:bg-background/80 backdrop-blur-md shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90 min-w-0"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl overflow-hidden shadow-sm bg-white border border-border/40 shrink-0">
            <img src="/logo.jpg" alt="SH Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-[10px] sm:text-sm font-bold tracking-tight text-foreground leading-none truncate">
              SHERLOCK HOLMES CLUB
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-wider text-muted-foreground uppercase font-bold mt-0.5">
              KARE Campus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Login</span>
            </Button>
          </Link>
          <Link href="/join">
            <Button size="sm" className="gap-1.5 font-medium rounded-xl shadow-sm">
              <span>Join Club</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-foreground"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/60 bg-background/95 dark:bg-background/98 backdrop-blur-md md:hidden"
          >
            <div className="space-y-1 px-4 pt-3 pb-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/70 dark:hover:bg-secondary/40 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border/60 mt-2 space-y-2">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/70 dark:hover:bg-secondary/40 hover:text-foreground transition-colors"
                >
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>Admin Login</span>
                </Link>
                <Link href="/join" onClick={() => setIsOpen(false)} className="block w-full">
                  <Button nativeButton={false} className="w-full justify-center rounded-xl py-5 gap-2">
                    <span>Join Club</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
