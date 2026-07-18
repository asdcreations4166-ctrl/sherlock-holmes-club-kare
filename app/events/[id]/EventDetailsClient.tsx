"use client";

import React, { use, useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, User, AlertCircle } from "lucide-react";
import { getEventById } from "@/services/clubService";
import { Event as ClubEvent } from "@/types";

interface EventCountdownProps {
  targetDate: Date;
}

function EventCountdown({ targetDate }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <Card className="p-5 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Commences In</p>
      <div className="flex gap-4">
        {[
          { label: "D", value: timeLeft.days },
          { label: "H", value: timeLeft.hours },
          { label: "M", value: timeLeft.minutes },
          { label: "S", value: timeLeft.seconds },
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="font-heading text-xl sm:text-2xl font-bold text-primary">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{unit.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface EventDetailsClientProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsClient({ params }: EventDetailsClientProps) {
  const { id } = use(params);
  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading event", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <PageBanner
          title="Event Details"
          breadcrumbs={[
            { label: "Events", href: "/events" },
            { label: "Loading..." },
          ]}
        />
        <Section>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-10">
                <Skeleton className="aspect-video w-full rounded-3xl bg-secondary" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4 bg-secondary" />
                  <Skeleton className="h-20 w-full bg-secondary" />
                </div>
              </div>
              <div className="lg:col-span-4">
                <Skeleton className="h-96 w-full rounded-3xl bg-secondary" />
              </div>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <PageBanner
          title="Event Not Found"
          breadcrumbs={[
            { label: "Events", href: "/events" },
            { label: "Not Found" },
          ]}
        />
        <Section>
          <Container>
            <div className="py-12">
              <EmptyState
                title="Event Not Found"
                description="The requested event does not exist in the database or may have been removed."
                icon={<AlertCircle className="h-12 w-12 text-destructive/80" />}
              />
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={event.title}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content Area (Banner, Description, Rules) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Event Banner */}
              <div className="aspect-video w-full bg-secondary/35 rounded-3xl border border-border/80 flex items-center justify-center relative overflow-hidden group shadow-xs">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-sm sm:text-base font-bold text-muted-foreground uppercase tracking-widest">
                    Event Banner Placeholder
                  </span>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="rounded-lg uppercase font-bold text-[10px] tracking-wider py-1 px-2.5">
                    Category: {event.category || "other"}
                  </Badge>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <Heading title="About the Event" level={2} align="left" />
                <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </Card>
              </div>

              {/* Rules Section */}
              <div className="space-y-4">
                <Heading title="Guidelines & Rules" level={2} align="left" />
                <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-2xl">
                  {event.rules && event.rules.length > 0 ? (
                    <ol className="space-y-3 text-xs sm:text-sm text-muted-foreground list-decimal pl-5">
                      {event.rules.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rule}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground italic">
                      No specific guidelines or rules have been listed for this event.
                    </p>
                  )}
                </Card>
              </div>
            </div>

            {/* Right Sidebar Area (Metadata & Registration Action) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Event Countdown */}
              {(() => {
                const combinedStr = event.time ? `${event.date} ${event.time}` : event.date;
                const parsedDate = new Date(combinedStr);
                const isValid = !isNaN(parsedDate.getTime()) && parsedDate.getTime() > Date.now();
                if (!isValid) return null;
                return <EventCountdown targetDate={parsedDate} />;
              })()}

              {/* Event Details Card */}
              <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-3xl shadow-sm space-y-6">
                <h3 className="font-heading text-lg font-bold text-foreground pb-3 border-b border-border/60">
                  Event Information
                </h3>
                
                <div className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Date</p>
                      <p>{event.date}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Time</p>
                      <p>{event.time}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Venue</p>
                      <p>{event.location}</p>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Organizer</p>
                      <p>{event.contactEmail || "Club Coordinators"}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Button */}
                {event.registrationOpen && event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-xs active:scale-[0.98] transition-transform bg-primary text-primary-foreground hover:bg-primary/95 inline-flex items-center justify-center text-center"
                  >
                    Register Now
                  </a>
                ) : (
                  <Button
                    className="w-full py-6 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-xs"
                    disabled
                  >
                    Registration Closed
                  </Button>
                )}
                <p className="text-[10px] text-center text-muted-foreground leading-normal mt-2 font-medium">
                  Notice: Online registration opens once dates are confirmed by coordinators.
                </p>
              </Card>

              {/* Sidebar Help Card */}
              <Card className="p-5 border-0 bg-primary/5 rounded-2xl text-xs text-primary/80 leading-relaxed font-medium">
                <strong>Need Support?</strong> If you have questions about coordinates or registration parameters, send a message through the general contact form.
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
