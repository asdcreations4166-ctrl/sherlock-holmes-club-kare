"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import EmptyState from "./EmptyState";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
}

export default function FAQ({ items = [] }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-6">
        <EmptyState
          title="No FAQ Available"
          description="Frequently asked questions will be fetched from Firestore."
          icon={<HelpCircle className="h-6 w-6 stroke-[1.5]" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-border/80 bg-white/50 backdrop-blur-xs rounded-2xl overflow-hidden shadow-xs hover:border-border transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left flex items-center justify-between p-5 focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-semibold text-foreground text-sm sm:text-base pr-4">
                {item.question}
              </span>
              <span className="shrink-0 text-primary">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40 bg-white/10">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
