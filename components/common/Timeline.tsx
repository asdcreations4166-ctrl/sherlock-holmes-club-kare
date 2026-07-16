"use client";

import React from "react";
import EmptyState from "./EmptyState";
import { Hourglass } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items?: TimelineItem[];
}

export default function Timeline({ items = [] }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full py-8">
        <EmptyState
          title="No History Found"
          description="Timeline history and club milestones will sync from Firestore database."
          icon={<Hourglass className="h-6 w-6 stroke-[1.5]" />}
        />
      </div>
    );
  }

  return (
    <div className="relative border-l border-border/85 ml-3 pl-8 py-4 space-y-8">
      {items.map((item, index) => (
        <div key={index} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-[37px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:scale-110 transition-transform duration-300 z-10" />

          {/* Timeline Item Content */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {item.date}
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {item.title}
            </h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
