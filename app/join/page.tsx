"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, UserPlus } from "lucide-react";
import { subscribeSettings } from "@/services/clubService";
import { Settings } from "@/types";

export default function JoinClubPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isOpen = settings?.allowRegistrations || false;

  return (
    <>
      <PageBanner
        title="Join the Club"
        breadcrumbs={[{ label: "Join" }]}
      />

      <Section>
        <Container className="max-w-4xl space-y-10">
          <Heading
            title="Become a Member"
            subtitle="Follow the academic guidelines to enroll in the Kalasalingam Academy of Research and Education Sherlock Holmes Club."
            align="center"
          />

          {/* Registration Status Banner */}
          <Card className="p-6 border border-primary/20 bg-primary/5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
              <Info className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-foreground text-base">
                {loading ? (
                  <Skeleton className="h-5 w-32 bg-secondary" />
                ) : (
                  `Membership Status: ${isOpen ? "Open" : "Closed"}`
                )}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {loading ? (
                  <Skeleton className="h-4 w-full bg-secondary" />
                ) : isOpen ? (
                  "Online registration is currently open. Submit your credentials and join the organization today!"
                ) : (
                  "Online registration is currently closed. Enrolment dates and semesters will be published by faculty coordinators."
                )}
              </p>
            </div>
          </Card>

          {/* Process Timeline/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl flex flex-col gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                1
              </div>
              <h4 className="font-heading font-bold text-foreground">Eligibility Check</h4>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Open to all undergraduate and postgraduate student departments at KARE.
              </p>
            </Card>

            <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl flex flex-col gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                2
              </div>
              <h4 className="font-heading font-bold text-foreground">Online Enrolment</h4>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Submit your credentials and student register details via our portal.
              </p>
            </Card>

            <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl flex flex-col gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                3
              </div>
              <h4 className="font-heading font-bold text-foreground">Confirmation</h4>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Receive your approval notice and attend the club orientation session.
              </p>
            </Card>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col items-center gap-4 text-center p-8 rounded-3xl border border-border/80 bg-white/30 dark:bg-card/30 backdrop-blur-xs max-w-xl mx-auto shadow-2xs">
            <UserPlus className="h-10 w-10 text-muted-foreground stroke-[1.5] mb-2" />
            <h3 className="font-heading font-bold text-lg text-foreground">Registration Form</h3>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isOpen
                ? "Enrollment is live! Click the button below to fill out the application details."
                : "The application intake period is currently inactive. Please check back later."}
            </p>
            {loading ? (
              <Skeleton className="h-12 w-48 rounded-xl bg-secondary" />
            ) : isOpen && settings?.registrationLink ? (
              <Button
                className="mt-4 px-8 py-5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs bg-primary text-primary-foreground hover:bg-primary/95"
                asChild
              >
                <a href={settings.registrationLink} target="_blank" rel="noopener noreferrer">
                  Apply Online
                </a>
              </Button>
            ) : (
              <Button
                className="mt-4 px-8 py-5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs"
                disabled
              >
                Registration Inactive
              </Button>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
