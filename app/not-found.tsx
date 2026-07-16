"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/common/Container";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-16">
      {/* Dynamic blurred highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 max-w-lg"
        >
          {/* 404 Icon Badge */}
          <div className="h-16 w-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2 shadow-xs">
            <AlertCircle className="h-8 w-8 stroke-[1.5]" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
            404
          </h1>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-[-10px]">
            Page Not Found
          </h2>

          {/* Subtext */}
          <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page you are looking for does not exist or has been relocated. Check the address or return to the main dashboard.
          </p>

          {/* CTA Button */}
          <Button
            render={
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Return Home</span>
              </Link>
            }
            size="lg"
            className="rounded-xl px-8 py-6 text-sm font-semibold uppercase tracking-wider shadow-sm transition-transform active:scale-[0.98] mt-4"
          />
        </motion.div>
      </Container>
    </div>
  );
}
