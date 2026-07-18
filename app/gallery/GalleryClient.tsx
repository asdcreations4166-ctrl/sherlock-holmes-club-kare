"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { Filters } from "@/components/common/SearchAndFilter";
import { GalleryCard } from "@/components/common/Cards";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeGalleryImages } from "@/services/clubService";
import { GalleryItem } from "@/types";

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeGalleryImages((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const albums = [
    { label: "All Photos", value: "all" },
    { label: "Workshops", value: "workshops" },
    { label: "Inductions", value: "inductions" },
    { label: "Competitions", value: "competitions" },
  ];

  // Client-side category filtering
  const filteredItems = items.filter((item) => {
    if (selectedAlbum === "all") return true;
    return (item.category || "other").toLowerCase() === selectedAlbum.toLowerCase();
  });

  const handleNext = () => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItem.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;
      if (e.key === "Escape") {
        setActiveItem(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, filteredItems]);

  return (
    <>
      <PageBanner
        title="Club Gallery"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <Section>
        <Container className="space-y-8">
          <Heading
            title="Club Activity Gallery"
            subtitle="Browse visual records, event photos, and club activity archives."
            align="center"
          />

          {/* Album Selector */}
          <div className="flex justify-center">
            <Filters
              options={albums}
              selectedValue={selectedAlbum}
              onChange={(val) => setSelectedAlbum(val)}
            />
          </div>

          {/* Gallery Grid / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-border/80 bg-white/40 dark:bg-card/40 rounded-2xl overflow-hidden flex flex-col gap-3">
                  <Skeleton className="aspect-video w-full bg-secondary" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-1/4 bg-secondary" />
                    <Skeleton className="h-5 w-3/4 bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Gallery is Empty"
                description="Gallery will be updated soon. Visual assets are loading from Firebase Storage."
                icon={<Camera className="h-6 w-6 stroke-[1.5]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <GalleryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  albumName={item.category || "other"}
                  imageUrl={item.imageUrl}
                  onClick={() => setActiveItem(item)}
                />
              ))}
            </div>
          )}

          {/* Lightbox / Image Viewer UI */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
                onClick={() => setActiveItem(null)}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-hidden"
                  aria-label="Close Viewer"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Lightbox Content */}
                <motion.div
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden text-white flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Photo Canvas */}
                  <div className="aspect-video w-full bg-neutral-950 flex flex-col items-center justify-center relative select-none">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10 border border-white/10"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    {activeItem.imageUrl ? (
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <>
                        <ImageIcon className="h-16 w-16 text-white/20 mb-3" />
                        <span className="font-sans text-sm font-semibold text-white/40 uppercase tracking-widest">
                          Visual Asset Syncing...
                        </span>
                      </>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10 border border-white/10"
                      aria-label="Next Image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Caption Bar */}
                  <div className="p-5 bg-neutral-900 border-t border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {activeItem.category || "other"}
                    </span>
                    <h3 className="font-heading font-bold text-base">
                      {activeItem.title}
                    </h3>
                    {activeItem.description && (
                      <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                        {activeItem.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Section>
    </>
  );
}
