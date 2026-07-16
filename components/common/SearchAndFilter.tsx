"use client";

import React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- SEARCH BAR ---
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void;
}

export function SearchBar({ onSearchChange, className, placeholder = "Search...", ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="pl-11 py-5 bg-white dark:bg-background/80 text-foreground border-border rounded-xl focus-visible:ring-primary"
        {...props}
      />
    </div>
  );
}

// --- FILTERS (TABS) ---
interface FilterOption {
  label: string;
  value: string;
}

interface FiltersProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Filters({ options, selectedValue, onChange, className }: FiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {options.map((option) => {
        const isActive = selectedValue === option.value;
        return (
          <Button
            key={option.value}
            variant={isActive ? "default" : "outline"}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all",
              isActive ? "shadow-xs" : "border-border/80 bg-white/60 dark:bg-card/60 hover:bg-secondary/40 text-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

// --- PAGINATION ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination Navigation">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl border-border bg-white dark:bg-card text-foreground"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((number) => {
        const isActive = number === currentPage;
        return (
          <Button
            key={number}
            variant={isActive ? "default" : "outline"}
            onClick={() => onPageChange(number)}
            className={cn(
              "h-10 w-10 font-semibold rounded-xl border-border",
              isActive ? "bg-primary text-primary-foreground pointer-events-none" : "bg-white dark:bg-card text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {number}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl border-border bg-white dark:bg-card text-foreground"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
