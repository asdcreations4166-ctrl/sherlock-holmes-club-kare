"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, MotionStyle } from "framer-motion";

type HTMLAttributesWithoutMotion = Omit<
  React.HTMLAttributes<HTMLElement>,
  | "onDrag" | "onDragStart" | "onDragEnd" | "onDragOver" | "onDragLeave" | "onDragEnter" | "onDrop"
  | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onTransitionEnd"
  | "style"
>;

interface SectionProps extends HTMLAttributesWithoutMotion {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
  motionProps?: Omit<HTMLMotionProps<"section">, "children" | "className" | "id">;
}

export default function Section({
  children,
  id,
  className,
  animate = true,
  motionProps,
  style,
  ...props
}: SectionProps) {
  if (!animate) {
    return (
      <section
        id={id}
        className={cn("py-16 md:py-24 relative overflow-hidden", className)}
        style={style}
        {...props}
      >
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      style={style as MotionStyle}
      {...motionProps}
      {...(props as Omit<typeof props, "ref">)}
    >
      {children}
    </motion.section>
  );
}
