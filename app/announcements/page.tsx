"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { SearchBar, Filters, Pagination } from "@/components/common/SearchAndFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { subscribeAnnouncements } from "@/services/clubService";
import { Announcement } from "@/types";

const ITEMS_PER_PAGE = 5;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((data) => {
      setAnnouncements(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = [
    { label: "All News", value: "all" },
    { label: "General", value: "general" },
    { label: "Academic", value: "academic" },
    { label: "Events", value: "events" },
  ];

  // Client-side filtering
  const filtered = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "all" ||
      (item.category || "general").toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Sorting: Pinned (important) first, then date descending
  const sortedAnnouncements = [...filtered].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) {
      return timeB - timeA;
    }
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnnouncements = sortedAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <PageBanner
        title="Club Announcements"
        breadcrumbs={[{ label: "Announcements" }]}
      />

      <Section>
        <Container className="space-y-8">
          <Heading
            title="Latest Announcements"
            subtitle="Stay informed with official updates, deadlines, and circulars from the club committee."
            align="center"
          />

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs shadow-xs">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search announcements..."
                onSearchChange={(val) => {
                  setSearch(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <Filters
              options={categories}
              selectedValue={category}
              onChange={(val) => {
                setCategory(val);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Announcements Listings */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 bg-secondary" />
                    <Skeleton className="h-5 w-16 bg-secondary" />
                  </div>
                  <Skeleton className="h-6 w-1/3 bg-secondary" />
                  <Skeleton className="h-4 w-full bg-secondary" />
                  <Skeleton className="h-4 w-5/6 bg-secondary" />
                </div>
              ))
            ) : paginatedAnnouncements.length > 0 ? (
              paginatedAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-6 rounded-2xl border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 transition-all duration-300 backdrop-blur-xs flex flex-col sm:flex-row justify-between items-start gap-4 shadow-2xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {announcement.category || "general"}
                      </span>
                      {announcement.important && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                      {announcement.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 sm:pt-1 font-medium">
                    {announcement.date}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8">
                <EmptyState
                  title={search ? "No Announcements Match" : "No Announcements Available"}
                  description={
                    search
                      ? `No announcements match "${search}". Try adjusting your keywords.`
                      : "There are no active circulars or announcements at this time. Check back later."
                  }
                  icon={<Bell className="h-6 w-6 stroke-[1.5]" />}
                />
              </div>
            )}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
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
