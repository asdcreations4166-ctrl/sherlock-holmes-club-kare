"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-50 bg-background" />;
  }

  // If user prefers reduced motion, render a beautiful static mesh gradient
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
        {/* Soft background tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 via-white to-blue-50/50 dark:from-slate-950/20 dark:via-background/50 dark:to-blue-950/25 transition-colors duration-500" />
        
        {/* Static soft blobs */}
        <div className="absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full bg-[oklch(0.42_0.16_244_/_0.06)] dark:bg-[oklch(0.55_0.16_244_/_0.10)] blur-[160px]" />
        <div className="absolute top-1/4 -right-40 h-[750px] w-[750px] rounded-full bg-[oklch(0.85_0.08_240_/_0.15)] dark:bg-[oklch(0.35_0.10_240_/_0.12)] blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 h-[550px] w-[550px] rounded-full bg-[oklch(0.42_0.16_244_/_0.04)] dark:bg-[oklch(0.55_0.16_244_/_0.06)] blur-[140px]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background select-none pointer-events-none">
      {/* 1. Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/60 via-white/80 to-blue-50/60 dark:from-slate-950/20 dark:via-background/50 dark:to-blue-950/25 transition-colors duration-500" />

      {/* 2. Fluid Mesh Gradient - Top-Left KARE Blue Blob */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -90, 60, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full bg-[oklch(0.42_0.16_244_/_0.07)] dark:bg-[oklch(0.55_0.16_244_/_0.12)] blur-[160px] backface-hidden"
      />

      {/* 3. Fluid Mesh Gradient - Center-Right Light Blue Blob */}
      <motion.div
        animate={{
          x: [0, -100, 70, 0],
          y: [0, 60, -80, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/4 -right-40 h-[750px] w-[750px] rounded-full bg-[oklch(0.85_0.08_240_/_0.18)] dark:bg-[oklch(0.35_0.10_240_/_0.15)] blur-[180px] backface-hidden"
      />

      {/* 4. Fluid Mesh Gradient - Bottom-Left KARE Blue Soft Blob */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute -bottom-40 left-1/4 h-[550px] w-[550px] rounded-full bg-[oklch(0.42_0.16_244_/_0.05)] dark:bg-[oklch(0.55_0.16_244_/_0.08)] blur-[140px] backface-hidden"
      />

      {/* 5. Fluid Mesh Gradient - Accent Soft White / Indigo Flow */}
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, -50, 40, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/2 left-1/3 h-[450px] w-[450px] rounded-full bg-[oklch(0.95_0.02_240_/_0.20)] dark:bg-[oklch(0.30_0.12_260_/_0.12)] blur-[120px] backface-hidden"
      />
    </div>
  );
}
