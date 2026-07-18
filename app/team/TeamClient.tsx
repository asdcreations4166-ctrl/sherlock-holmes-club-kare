"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, ShieldAlert, Award, CalendarClock, Mail, Linkedin } from "lucide-react";
import { subscribeTeamMembers } from "@/services/clubService";
import { TeamMember } from "@/types";

export default function TeamClient() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeTeamMembers((data) => {
      setMembers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter members by division
  const advisors = members.filter((m) => m.division === "advisors");
  const coordinators = members.filter((m) => m.division === "coordinators");
  const bearers = members.filter((m) => m.division === "bearers");
  const committee = members.filter((m) => m.division === "committee");
  const pastCommittees = members.filter((m) => m.division === "alumni");

  const renderRoster = (groupMembers: TeamMember[], fallbackTitle: string, fallbackDesc: string, fallbackIcon: React.ReactNode) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full bg-secondary" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-5 w-2/3 bg-secondary" />
                <Skeleton className="h-4 w-1/2 bg-secondary" />
                <Skeleton className="h-3 w-1/3 bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (groupMembers.length === 0) {
      return (
        <EmptyState
          title={fallbackTitle}
          description={fallbackDesc}
          icon={fallbackIcon}
        />
      );
    }

    const sorted = [...groupMembers].sort((a, b) => (a.priorityOrder || 10) - (b.priorityOrder || 10));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sorted.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-2xl border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 backdrop-blur-xs flex flex-col items-center text-center gap-4 group hover:border-primary/20 transition-all duration-300 shadow-2xs"
          >
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border/50 bg-secondary flex items-center justify-center">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Users className="h-8 w-8 text-muted-foreground/60" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                {member.name}
              </h3>
              <p className="text-xs text-primary font-semibold">
                {member.role}
              </p>
              {member.academicYear && (
                <p className="text-[10px] text-slate-400 font-bold">
                  {member.academicYear}
                </p>
              )}
              {member.department && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {member.department}
                </p>
              )}
            </div>
            {(member.email || member.linkedin) && (
              <div className="flex gap-2.5 mt-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg bg-secondary/50"
                    aria-label={`${member.name} Email`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg bg-secondary/50"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageBanner
        title="Club Committee"
        breadcrumbs={[{ label: "Team" }]}
      />

      {/* Faculty Coordinators Section */}
      <Section id="faculty-coordinators">
        <Container>
          <Heading
            title="Faculty Advisors"
            subtitle="Advisors from KARE supervising the club's compliance and student activities."
            align="center"
          />
          {renderRoster(
            advisors,
            "Advisors Syncing",
            "Faculty mentors and advisor profile data is loading from the Firestore registry.",
            <GraduationCap className="h-6 w-6 stroke-[1.5]" />
          )}
        </Container>
      </Section>

      {/* Student Coordinators Section */}
      <Section id="student-coordinators" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container>
          <Heading
            title="Student Coordinators"
            subtitle="Student organizers overseeing program logistics and workshops."
            align="center"
          />
          {renderRoster(
            coordinators,
            "Coordinators Syncing",
            "Student coordinator profile listings will appear after database initialization.",
            <Users className="h-6 w-6 stroke-[1.5]" />
          )}
        </Container>
      </Section>

      {/* Office Bearers Section */}
      <Section id="office-bearers">
        <Container>
          <Heading
            title="Office Bearers"
            subtitle="President, Vice President, Secretary, and treasurer steering the organization."
            align="center"
          />
          {renderRoster(
            bearers,
            "Office Bearers Offline",
            "Executive committee details will appear after database initialization.",
            <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
          )}
        </Container>
      </Section>

      {/* Executive Members Section */}
      <Section id="executive-members" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container>
          <Heading
            title="Executive Committee"
            subtitle="Student division heads and chapter leads managing club sub-activities."
            align="center"
          />
          {renderRoster(
            committee,
            "Committee Roster Loading",
            "Executive division head listings are currently offline.",
            <Award className="h-6 w-6 stroke-[1.5]" />
          )}
        </Container>
      </Section>

      {/* Past Committees Section */}
      <Section id="past-committees">
        <Container>
          <Heading
            title="Past Committees"
            subtitle="Alumni members and former executive committee officers."
            align="center"
          />
          {renderRoster(
            pastCommittees,
            "Archive Database Syncing",
            "Alumni registry and history logs will sync in Phase 2.",
            <CalendarClock className="h-6 w-6 stroke-[1.5]" />
          )}
        </Container>
      </Section>
    </>
  );
}
