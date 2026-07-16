"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Container from "./Container";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function PageBanner({ title, breadcrumbs }: PageBannerProps) {
  return (
    <div className="relative py-16 bg-white/20 border-b border-border/60 backdrop-blur-xs overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          </div>

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center hover:text-primary transition-colors focus:outline-hidden"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>

            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  {isLast || !item.href ? (
                    <span className="font-medium text-foreground select-none">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-primary transition-colors focus:outline-hidden"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </motion.div>
      </Container>
    </div>
  );
}
