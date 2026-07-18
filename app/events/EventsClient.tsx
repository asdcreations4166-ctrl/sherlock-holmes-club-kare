"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { SearchBar, Filters, Pagination } from "@/components/common/SearchAndFilter";
import { EventCard } from "@/components/common/Cards";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeEvents } from "@/services/clubService";
import { Event as ClubEvent } from "@/types";

const ITEMS_PER_PAGE = 6;

export default function EventsClient() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = subscribeEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = [
    { label: "All Events", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Workshops", value: "workshops" },
  ];

  // Client-side filtering
  const filteredEvents = events.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    let matchesCategory = true;
    if (category === "upcoming") {
      matchesCategory = item.status === "upcoming";
    } else if (category === "completed") {
      matchesCategory = item.status === "completed";
    } else if (category === "workshops") {
      matchesCategory = (item.category || "other").toLowerCase() === "workshops";
    }

    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderContent = () => {
    if (loading) {
      return (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col gap-3">
              <Skeleton className="h-5 w-16 bg-secondary" />
              <Skeleton className="h-6 w-2/3 bg-secondary" />
              <Skeleton className="h-4 w-full bg-secondary" />
              <Skeleton className="h-4 w-5/6 bg-secondary" />
            </div>
          ))}
        </div>
      );
    }

    if (paginatedEvents.length === 0) {
      return (
        <div className="py-8">
          <EmptyState
            title={search ? "No Matches Found" : "No Events Available"}
            description={
              search
                ? `We couldn't find any events matching "${search}". Try resetting your filters.`
                : "The event repository is empty. Please check back later for new announcements."
            }
            icon={<Calendar className="h-6 w-6 stroke-[1.5]" />}
          />
        </div>
      );
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((item) => (
            <EventCard
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              location={item.location}
              category={item.category || "other"}
              description={item.description}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {paginatedEvents.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 hover:border-primary/20 transition-all duration-300 backdrop-blur-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {item.category || "other"}
                </span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                  item.status === "upcoming"
                    ? "bg-emerald-100 text-emerald-800"
                    : item.status === "ongoing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-neutral-100 text-neutral-800"
                )}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                <Link href={`/events/${item.id}`} className="hover:text-primary transition-colors">
                  {item.title}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs text-muted-foreground shrink-0 font-medium">
              <div>{item.date} at {item.time}</div>
              <div>{item.location}</div>
              <Link
                href={`/events/${item.id}`}
                className="text-primary hover:underline font-bold text-xs uppercase tracking-wider mt-1 md:mt-0"
              >
                Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageBanner
        title="Club Events"
        breadcrumbs={[{ label: "Events" }]}
      />

      <Section>
        <Container className="space-y-8">
          <Heading
            title="Event Schedule"
            subtitle="Search and browse through our workshops, contests, and reasoning challenges."
            align="center"
          />

          {/* Search, Filters, and Layout Toggles Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs shadow-xs">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search events by title or topics..."
                onSearchChange={(val) => {
                  setSearch(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Filters
                options={categories}
                selectedValue={category}
                onChange={(val) => {
                  setCategory(val);
                  setCurrentPage(1);
                }}
              />

              {/* Grid / List Layout Toggle Buttons */}
              <div className="hidden sm:flex border border-border/80 bg-white/80 dark:bg-card/80 p-1.5 rounded-xl gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-8 w-8 rounded-lg transition-all",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground hover:bg-primary/95"
                      : "text-muted-foreground hover:bg-secondary/40"
                  )}
                  aria-label="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 rounded-lg transition-all",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground hover:bg-primary/95"
                      : "text-muted-foreground hover:bg-secondary/40"
                  )}
                  aria-label="List View"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Render Main Content */}
          {renderContent()}

          {/* Pagination UI */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              className="pt-4"
            />
          )}
        </Container>
      </Section>
    </>
  );
}
