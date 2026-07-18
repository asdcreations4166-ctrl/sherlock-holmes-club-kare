"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { SearchBar } from "@/components/common/SearchAndFilter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, ExternalLink, Calendar } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";

interface DownloadItem {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  createdAt?: unknown;
}

export default function DownloadsClient() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "downloads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: DownloadItem[] = [];
        snap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as DownloadItem);
        });
        setDownloads(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading downloads:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredDownloads = downloads.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageBanner
        title="Downloads Cabinet"
        breadcrumbs={[{ label: "Downloads" }]}
      />

      <Section>
        <Container className="space-y-8">
          <Heading
            title="Syllabi, Rules & Manuals"
            subtitle="Access and download official reference documents, guidelines, and calendar schedules."
            align="center"
          />

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs shadow-xs max-w-md mx-auto">
            <div className="flex-1 w-full">
              <SearchBar
                placeholder="Search documents by title..."
                onSearchChange={(val) => setSearch(val)}
              />
            </div>
          </div>

          {/* Downloads Listings Grid */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl bg-secondary shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4 bg-secondary" />
                      <Skeleton className="h-4 w-1/3 bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDownloads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDownloads.map((item) => (
                  <Card
                    key={item.id}
                    className="p-6 border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 hover:border-primary/20 transition-all duration-300 backdrop-blur-xs flex items-start gap-4 shadow-2xs group"
                  >
                    {/* Document Icon */}
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                      <FileText className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary">
                          {item.fileType || "LINK"}
                        </span>
                        {item.fileSize && item.fileSize !== "Link Reference" && (
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {item.fileSize}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Official resource</span>
                        </span>

                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-primary hover:underline"
                        >
                          <span>Access File</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8">
                <EmptyState
                  title={search ? "No Documents Match" : "No Resources Available"}
                  description={
                    search
                      ? `We couldn't find any resources matching "${search}". Try adjusting your query.`
                      : "The downloads repository is currently empty. Check back later for guidelines."
                  }
                  icon={<Download className="h-6 w-6 stroke-[1.5]" />}
                />
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
