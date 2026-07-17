"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Camera, Users, Bell, Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard, AnnouncementCard, GalleryCard } from "@/components/common/Cards";
import {
  subscribeHomepageData,
  subscribeEvents,
  subscribeAnnouncements,
  subscribeTeamMembers,
  subscribeGalleryImages,
  subscribeContactInfo,
} from "@/services/clubService";
import {
  HomepageData,
  Event as ClubEvent,
  Announcement,
  OfficeBearer as TeamMember,
  GalleryItem,
  ContactInfo,
} from "@/types";

export default function Home() {
  // 1. States for Homepage Content & Collections
  const [homeData, setHomeData] = useState<HomepageData | null>(null);
  const [homeLoading, setHomeLoading] = useState(true);

  const [upcomingEvents, setUpcomingEvents] = useState<ClubEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const [bearers, setBearers] = useState<TeamMember[]>([]);
  const [bearersLoading, setBearersLoading] = useState(true);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactLoading, setContactLoading] = useState(true);

  // 2. Database Subscriptions
  useEffect(() => {
    const unsubHome = subscribeHomepageData((data) => {
      setHomeData(data);
      setHomeLoading(false);
    });

    const unsubEvents = subscribeEvents((data) => {
      // Filter upcoming status only
      const upcoming = data.filter((e) => e.status === "upcoming").slice(0, 3);
      setUpcomingEvents(upcoming);
      setEventsLoading(false);
    });

    const unsubAnnouncements = subscribeAnnouncements((data) => {
      setAnnouncements(data.slice(0, 3));
      setAnnouncementsLoading(false);
    });

    const unsubBearers = subscribeTeamMembers((data) => {
      // Filter office bearers division only and sort by priorityOrder
      const group = data.filter((m) => m.division === "bearers");
      const sorted = [...group].sort((a, b) => (a.priorityOrder || 10) - (b.priorityOrder || 10)).slice(0, 4);
      setBearers(sorted);
      setBearersLoading(false);
    });

    const unsubGallery = subscribeGalleryImages((data) => {
      setGalleryItems(data.slice(0, 3));
      setGalleryLoading(false);
    });

    const unsubContact = subscribeContactInfo((data) => {
      setContactInfo(data);
      setContactLoading(false);
    });

    return () => {
      unsubHome();
      unsubEvents();
      unsubAnnouncements();
      unsubBearers();
      unsubGallery();
      unsubContact();
    };
  }, []);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden">
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Club Logo */}
            <div className="group mt-2 sm:-mt-4">
              {/* Light mode logo */}
              <img
                src="/logo-light.png"
                alt="Sherlock Holmes Club Logo"
                className="h-32 sm:h-44 w-auto object-contain block dark:hidden drop-shadow-lg hover:scale-[1.04] transition-transform duration-300 ease-out"
              />
              {/* Dark mode logo */}
              <img
                src="/logo-dark.png"
                alt="Sherlock Holmes Club Logo"
                className="h-32 sm:h-44 w-auto object-contain hidden dark:block drop-shadow-lg hover:scale-[1.04] transition-transform duration-300 ease-out"
              />
            </div>

            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10 text-xs font-semibold uppercase tracking-wider">
              <span>{homeData?.heroTagline || "Sherlock Holmes Club × KARE"}</span>
            </div>

            {/* Main Premium Heading */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]">
              {homeData?.heroTitle ? (
                <span>{homeData.heroTitle}</span>
              ) : (
                <>
                  The Art of Logical <span className="text-primary bg-clip-text">Deduction</span> & Analytical Solving
                </>
              )}
            </h1>

            {/* Subtext */}
            <div className="font-sans text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mt-2 text-center">
              <span>{homeData?.heroDescription || "Kalasalingam Academy of Research and Education's premier forum for logical inquiry, cryptography, and analytical problem-solving methodologies. Educating minds to see what others only look at."}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 w-full sm:w-auto px-4 sm:px-0">
              <Button
                render={
                  <Link href="/join">
                    <span>Join Club</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
                nativeButton={false}
                size="lg"
                className="rounded-xl px-8 py-6 text-sm font-medium shadow-sm transition-transform hover:scale-[1.02]"
              />
              <Button
                render={<Link href="/events">Explore Events</Link>}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-6 text-sm font-medium border-border hover:bg-secondary/40 transition-transform hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. About Preview */}
      <Section id="about">
        <Container className="max-w-4xl text-center flex flex-col items-center gap-6">
          <Heading
            title="About the Club"
            subtitle="Learn about the Sherlock Holmes Club at Kalasalingam Academy of Research and Education."
            align="center"
          />
          <div className="p-8 rounded-3xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs w-full">
            <p className="font-sans text-xs sm:text-sm sm:text-base text-muted-foreground leading-relaxed">
              {homeData?.aboutPreview ||
                "The Sherlock Holmes Club description will be synced dynamically from our database. The student organization focuses on fostering critical thinking, logical inquiry, and analytical solving skills through campus workshops, academic events, and collaborative reasoning exercises."}
            </p>
            <Button
              render={<Link href="/about">Learn More</Link>}
              nativeButton={false}
              variant="outline"
              className="mt-6 rounded-xl border-border bg-white dark:bg-card hover:bg-secondary/40 text-foreground"
            />
          </div>
        </Container>
      </Section>

      {/* 3. Upcoming Events Preview */}
      <Section id="events" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Heading
              title="Upcoming Events"
              subtitle="Explore our upcoming events and workshops."
              align="left"
              className="sm:text-left text-center"
            />
            <Button
              render={<Link href="/events">View All Events</Link>}
              nativeButton={false}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold"
            />
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col gap-3">
                  <Skeleton className="h-5 w-16 bg-secondary" />
                  <Skeleton className="h-6 w-2/3 bg-secondary" />
                  <Skeleton className="h-4 w-full bg-secondary" />
                  <Skeleton className="h-12 w-full bg-secondary mt-2" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((item) => (
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
          ) : (
            <EmptyState
              title="No upcoming events available"
              description="The event calendar is empty. Upcoming events will sync from Firestore database."
              icon={<Calendar className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* 4. Announcements Preview */}
      <Section id="announcements">
        <Container className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Heading
              title="Latest Announcements"
              subtitle="Stay informed with official circulars and club news."
              align="left"
              className="sm:text-left text-center"
            />
            <Button
              render={<Link href="/announcements">All Circulars</Link>}
              nativeButton={false}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold"
            />
          </div>

          {announcementsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col gap-2">
                  <Skeleton className="h-4 w-20 bg-secondary" />
                  <Skeleton className="h-6 w-1/3 bg-secondary" />
                  <Skeleton className="h-4 w-5/6 bg-secondary" />
                </div>
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 transition-all duration-300 backdrop-blur-xs flex flex-col sm:flex-row justify-between items-start gap-4 shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {item.category || "general"}
                    </span>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 font-medium">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No announcements available"
              description="Official circulars and notifications will load from database."
              icon={<Bell className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* 5. Office Bearers Preview */}
      <Section id="team" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Heading
              title="Office Bearers"
              subtitle="Meet the executive committee leading our chapters and workshops."
              align="left"
              className="sm:text-left text-center"
            />
            <Button
              render={<Link href="/team">Full Committee</Link>}
              nativeButton={false}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold"
            />
          </div>

          {bearersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-xs flex flex-col items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full bg-secondary" />
                  <Skeleton className="h-5 w-2/3 bg-secondary" />
                  <Skeleton className="h-4 w-1/2 bg-secondary" />
                </div>
              ))}
            </div>
          ) : bearers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bearers.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-2xl border border-border/80 bg-white/40 hover:bg-white/70 dark:bg-card/40 dark:hover:bg-card/70 backdrop-blur-xs flex flex-col items-center text-center gap-3 hover:border-primary/20 transition-all duration-300 shadow-2xs"
                >
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-foreground leading-tight">{member.name}</h3>
                    <p className="font-sans text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider mt-1">{member.role}</p>
                    {member.department && <p className="font-sans text-[10px] text-muted-foreground mt-0.5">{member.department}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No committee information available"
              description="Club executive board and faculty coordinator details will sync in Phase 2."
              icon={<Users className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* 6. Gallery Preview */}
      <Section id="gallery">
        <Container className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Heading
              title="Club Gallery"
              subtitle="Visual archives from our past events and induction programs."
              align="left"
              className="sm:text-left text-center"
            />
            <Button
              render={<Link href="/gallery">View Gallery</Link>}
              nativeButton={false}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold"
            />
          </div>

          {galleryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-border/80 bg-white/40 dark:bg-card/40 rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-video w-full bg-secondary" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-1/4 bg-secondary" />
                    <Skeleton className="h-5 w-3/4 bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <GalleryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  albumName={item.category || "other"}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Gallery will be updated soon"
              description="Photo gallery and activity logs will load from Firebase Storage."
              icon={<Camera className="h-6 w-6 stroke-[1.5]" />}
            />
          )}
        </Container>
      </Section>

      {/* 7. Join Club */}
      <Section id="join" className="bg-white/30 dark:bg-card/20 backdrop-blur-xs">
        <Container className="max-w-xl text-center flex flex-col items-center gap-4">
          <Heading
            title="Join the Club"
            subtitle="Want to join our division? General enrollment opens every academic semester."
            align="center"
          />
          <Button
            render={<Link href="/join">Membership Information</Link>}
            nativeButton={false}
            className="rounded-xl px-8 py-5 text-xs font-bold uppercase tracking-wider shadow-sm mt-2"
          />
        </Container>
      </Section>

      {/* 8. Contact Preview */}
      <Section id="contact">
        <Container>
          <Heading
            title="Contact Information"
            subtitle="Official campus details for inquiries and recommendations."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Address */}
            <div className="p-6 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs flex flex-col gap-3 shadow-2xs">
              <MapPin className="h-6 w-6 text-primary" />
              <h4 className="font-heading font-bold text-foreground">Club Office</h4>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {contactInfo?.officeLocation || "Kalasalingam Academy of Research and Education, Anand Nagar, Krishnankoil - 626126, Tamil Nadu, India."}
              </p>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs flex flex-col gap-3 shadow-2xs">
              <Mail className="h-6 w-6 text-primary" />
              <h4 className="font-heading font-bold text-foreground">Email Support</h4>
              <a href={`mailto:${contactInfo?.emailAddress || "sherlockholmes@kla.ac.in"}`} className="font-sans text-xs text-muted-foreground hover:text-primary transition-colors">
                {contactInfo?.emailAddress || "sherlockholmes@kla.ac.in"}
              </a>
            </div>

            {/* Phone */}
            <div className="p-6 rounded-2xl border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs flex flex-col gap-3 shadow-2xs">
              <Phone className="h-6 w-6 text-primary" />
              <h4 className="font-heading font-bold text-foreground">Helpline</h4>
              <p className="font-sans text-xs text-muted-foreground">
                {contactInfo?.phoneHelpline || "+91 (4563) 289012"}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
