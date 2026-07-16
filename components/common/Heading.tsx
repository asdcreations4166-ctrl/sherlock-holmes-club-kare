import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function Heading({
  title,
  subtitle,
  align = "left",
  level = 2,
  className,
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const sizeClasses = {
    1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    2: "text-3xl md:text-4xl font-semibold tracking-tight",
    3: "text-2xl md:text-3xl font-medium tracking-tight",
    4: "text-xl md:text-2xl font-medium",
  };

  return (
    <div className={cn("flex flex-col gap-2 mb-8 md:mb-12", alignmentClasses[align], className)}>
      <Tag className={cn("text-foreground font-heading", sizeClasses[level])}>
        {title}
      </Tag>
      {subtitle && (
        <p className="max-w-2xl text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
