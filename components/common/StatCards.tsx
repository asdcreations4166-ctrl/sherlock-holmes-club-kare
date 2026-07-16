"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface StatCardsProps {
  stats?: StatItem[];
  loading?: boolean;
}

export default function StatCards({ stats, loading = false }: StatCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl flex flex-col gap-2">
            <Skeleton className="h-6 w-6 rounded-md bg-secondary" />
            <Skeleton className="h-8 w-16 bg-secondary" />
            <Skeleton className="h-4 w-24 bg-secondary" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 border border-border/80 bg-white/50 hover:bg-white/80 dark:bg-card/50 dark:hover:bg-card/85 transition-all duration-300 backdrop-blur-xs rounded-2xl flex flex-col gap-2 shadow-xs group">
          {stat.icon && (
            <div className="text-primary group-hover:scale-105 transition-transform duration-300">
              {stat.icon}
            </div>
          )}
          <span className="font-heading text-3xl font-bold text-foreground">
            {stat.value}
          </span>
          <span className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
