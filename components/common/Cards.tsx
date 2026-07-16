"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// --- FEATURE CARD ---
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="p-6 border border-border/80 bg-white/50 hover:bg-white/90 dark:bg-card/50 dark:hover:bg-card/90 hover:shadow-xs transition-all duration-300 rounded-2xl flex flex-col gap-3 group">
      {icon && <div className="text-primary group-hover:scale-105 transition-transform duration-300">{icon}</div>}
      <h3 className="font-heading font-bold text-lg text-foreground mt-2">{title}</h3>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}

// --- EVENT CARD ---
interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
}

export function EventCard({ id, title, date, location, category, description }: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full border border-border/80 bg-white/60 hover:bg-white/90 dark:bg-card/60 dark:hover:bg-card/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 flex flex-col flex-1 gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="rounded-md uppercase tracking-wider text-[10px] font-bold">
              {category}
            </Badge>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-heading font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
              <Link href={`/events/${id}`}>{title}</Link>
            </h3>
            <p className="font-sans text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-auto space-y-2 text-xs text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/events/${id}`}
          className="flex items-center justify-center gap-1.5 py-3.5 text-center text-xs font-semibold text-primary bg-secondary/30 hover:bg-secondary/60 transition-colors uppercase tracking-wider border-t border-border/30"
        >
          <span>View Event Details</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>
    </motion.div>
  );
}

// --- TEAM CARD ---
interface TeamCardProps {
  name: string;
  role: string;
  department?: string;
  image?: string; // Future use with Next Image
}

export function TeamCard({ name, role, department }: TeamCardProps) {
  return (
    <Card className="p-6 border border-border/80 bg-white/60 hover:bg-white/90 dark:bg-card/60 dark:hover:bg-card/90 hover:shadow-xs transition-all duration-300 rounded-2xl flex flex-col items-center text-center gap-3">
      <div className="h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center text-primary mb-2">
        <User className="h-8 w-8 stroke-[1.5]" />
      </div>
      <div>
        <h3 className="font-heading font-bold text-base text-foreground leading-tight">{name}</h3>
        <p className="font-sans text-xs font-semibold text-primary uppercase tracking-wider mt-1">{role}</p>
        {department && <p className="font-sans text-xs text-muted-foreground mt-0.5">{department}</p>}
      </div>
    </Card>
  );
}

// --- GALLERY CARD ---
interface GalleryCardProps {
  id: string;
  title: string;
  albumName: string;
  imageUrl?: string;
  onClick?: () => void;
}

export function GalleryCard({ title, albumName, imageUrl, onClick }: GalleryCardProps) {
  return (
    <Card
      onClick={onClick}
      className="border border-border/80 bg-white/60 hover:bg-white/90 dark:bg-card/60 dark:hover:bg-card/90 hover:shadow-xs rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
    >
      <div className="aspect-video relative bg-secondary/30 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest group-hover:scale-105 transition-transform duration-300">
            Media Placeholder
          </span>
        )}
      </div>
      <div className="p-4 border-t border-border/40">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-0.5">
          {albumName}
        </span>
        <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-1">
          {title}
        </h3>
      </div>
    </Card>
  );
}

// --- ANNOUNCEMENT CARD ---
interface AnnouncementCardProps {
  title: string;
  date: string;
  content: string;
  category: string;
}

export function AnnouncementCard({ title, date, content, category }: AnnouncementCardProps) {
  return (
    <Card className="p-6 border border-border/80 bg-white/60 hover:bg-white/90 dark:bg-card/60 dark:hover:bg-card/90 hover:shadow-xs transition-all duration-300 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{date}</span>
        <Badge variant="outline" className="rounded-md text-[9px] uppercase tracking-wider font-bold">
          {category}
        </Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading font-bold text-lg text-foreground">{title}</h3>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {content}
        </p>
      </div>
    </Card>
  );
}
