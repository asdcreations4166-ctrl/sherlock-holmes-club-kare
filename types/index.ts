import { Timestamp, FieldValue } from "firebase/firestore";

export interface HomepageData {
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  joinText: string;
  aboutPreview: string;
}

export interface AboutData {
  description: string;
  vision: string;
  mission: string;
  objectives: string[];
  historyTimeline: { year: string; event: string; description?: string }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  registrationLink?: string;
  registrationOpen: boolean;
  status: "upcoming" | "completed" | "ongoing";
  category: "all" | "workshops" | "inductions" | "competitions" | "other";
  rules?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

// Keep ClubEvent alias for backwards compatibility
export type ClubEvent = Event;

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important?: boolean;
  category?: "general" | "academic" | "event" | "urgent";
}

export interface OfficeBearer {
  id: string;
  name: string;
  role: string;
  image?: string;
  email?: string;
  linkedin?: string;
  department?: string;
  priorityOrder: number;
  division?: "advisors" | "coordinators" | "bearers" | "committee" | "alumni";
  academicYear?: string;
}

// Keep TeamMember alias for backwards compatibility
export type TeamMember = OfficeBearer;

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  date?: string;
  category: "workshops" | "inductions" | "competitions" | "other";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Timestamp | FieldValue | Date;
}

export interface ContactInfo {
  officeLocation: string;
  emailAddress: string;
  phoneHelpline: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Settings {
  clubName: string;
  logoUrl?: string;
  universityName: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  registrationLink?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "superadmin" | "editor" | "mediateam";
  createdAt: Timestamp | FieldValue | Date;
}

export interface ActivityLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  timestamp: Timestamp | FieldValue | Date;
}

export interface WebsiteStatistics {
  id: string;
  viewsCount: number;
  totalMembers: number;
  totalEvents: number;
  updatedAt: Timestamp | FieldValue | Date;
}
