"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import Timeline from "@/components/common/Timeline";
import StatCards from "@/components/common/StatCards";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, Eye, Target, Flag, Users, Calendar, Award } from "lucide-react";
import { subscribeAboutData } from "@/services/clubService";
import { AboutData, WebsiteStatistics } from "@/types";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WebsiteStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe to About Club Info
    const unsubscribeAbout = subscribeAboutData((aboutDoc) => {
      setData(aboutDoc);
      setLoading(false);
    });

    // 2. Subscribe to websiteStatistics
    const unsubscribeStats = onSnapshot(doc(db, "websiteStatistics", "main"), (snap) => {
      if (snap.exists()) {
        setStats(snap.data() as WebsiteStatistics);
      }
      setStatsLoading(false);
    });

    return () => {
      unsubscribeAbout();
      unsubscribeStats();
    };
  }, []);

  const statsItems = stats
    ? [
        { value: `${stats.viewsCount || 0}`, label: "Total Visits", icon: <Eye className="h-6 w-6" /> },
        { value: `${stats.totalMembers || 0}`, label: "Active Members", icon: <Users className="h-6 w-6" /> },
        { value: `${stats.totalEvents || 0}`, label: "Workshops Held", icon: <Calendar className="h-6 w-6" /> },
        { value: "1", label: "University Chapters", icon: <Award className="h-6 w-6" /> },
      ]
    : [];

  return (
    <>
      <PageBanner
        title="About the Club"
        breadcrumbs={[{ label: "About" }]}
      />

      {/* About Club Section */}
      <Section id="about-club">
        <Container>
          <Heading
            title="Overview"
            subtitle="Learn about the core values of the Sherlock Holmes Club at KARE."
            align="center"
          />
          {loading ? (
            <div className="space-y-4 max-w-4xl mx-auto p-8 rounded-3xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs">
              <Skeleton className="h-5 w-3/4 bg-secondary" />
              <Skeleton className="h-5 w-full bg-secondary" />
              <Skeleton className="h-5 w-5/6 bg-secondary" />
            </div>
          ) : data?.description ? (
            <div className="p-8 rounded-3xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs max-w-4xl mx-auto">
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </div>
          ) : (
            <EmptyState
              title="Club Overview Loading..."
              description="The official description and campus registration logs are syncing from the database."
              icon={<Compass className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* Vision & Mission Sections */}
      <Section id="vision-mission" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Club Vision</h3>
              {loading ? (
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-5/6 mx-auto bg-secondary" />
                  <Skeleton className="h-4 w-2/3 mx-auto bg-secondary" />
                </div>
              ) : data?.vision ? (
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {data.vision}
                </p>
              ) : (
                <EmptyState
                  title="Vision Statement Offline"
                  description="Vision details will sync from Firebase."
                  icon={<Eye className="h-4 w-4 stroke-[1.5]" />}
                  className="py-6 border-0 bg-transparent shadow-none"
                />
              )}
            </div>

            {/* Mission */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Club Mission</h3>
              {loading ? (
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-5/6 mx-auto bg-secondary" />
                  <Skeleton className="h-4 w-2/3 mx-auto bg-secondary" />
                </div>
              ) : data?.mission ? (
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {data.mission}
                </p>
              ) : (
                <EmptyState
                  title="Mission Statement Offline"
                  description="Mission details will sync from Firebase."
                  icon={<Target className="h-4 w-4 stroke-[1.5]" />}
                  className="py-6 border-0 bg-transparent shadow-none"
                />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Objectives Section */}
      <Section id="objectives">
        <Container>
          <Heading
            title="Club Objectives"
            subtitle="The strategic aims that guide our workshops and student programs."
            align="center"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/60 bg-white/30 dark:bg-card/30 flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full bg-secondary shrink-0" />
                  <Skeleton className="h-4 w-5/6 bg-secondary" />
                </div>
              ))}
            </div>
          ) : data?.objectives && data.objectives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {data.objectives.map((objective, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 hover:border-primary/30 transition-all duration-300 flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Strategic Objectives Pending"
              description="Official guidelines and objectives are loading from the database."
              icon={<Flag className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* Activities / Timeline Section */}
      <Section id="activities" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container>
          <Heading
            title="Key Activities"
            subtitle="Explore our annual milestones and workshop timelines."
            align="center"
          />
          {loading ? (
            <div className="space-y-6 max-w-xl pl-8 relative border-l border-border/50 ml-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 relative">
                  <Skeleton className="absolute -left-[37px] top-1.5 h-4 w-4 rounded-full bg-secondary border border-background" />
                  <Skeleton className="h-4 w-12 bg-secondary" />
                  <Skeleton className="h-5 w-36 bg-secondary" />
                  <Skeleton className="h-4 w-5/6 bg-secondary" />
                </div>
              ))}
            </div>
          ) : data?.historyTimeline && data.historyTimeline.length > 0 ? (
            <Timeline
              items={data.historyTimeline.map((item) => ({
                date: item.year,
                title: item.event,
                description: item.description || "",
              }))}
            />
          ) : (
            <Timeline items={[]} />
          )}
        </Container>
      </Section>

      {/* Stats Section */}
      <Section id="stats">
        <Container className="flex flex-col items-center gap-8">
          <Heading
            title="Club Statistics"
            subtitle="Key metrics showing student involvement and club progress."
            align="center"
          />
          <StatCards stats={statsItems} loading={statsLoading} />
        </Container>
      </Section>
    </>
  );
}
