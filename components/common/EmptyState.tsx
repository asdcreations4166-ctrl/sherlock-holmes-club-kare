import React from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No information available",
  description = "Content for this section will be synced from Firebase.",
  icon,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-white/40 p-8 text-center backdrop-blur-xs", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
        {icon || <Compass className="h-6 w-6 stroke-[1.5]" />}
      </div>
      <h3 className="font-heading text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="max-w-md text-xs md:text-sm text-muted-foreground leading-relaxed mb-5">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" className="rounded-xl">
          {actionText}
        </Button>
      )}
    </div>
  );
}
