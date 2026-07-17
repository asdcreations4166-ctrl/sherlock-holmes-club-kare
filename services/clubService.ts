import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  HomepageData,
  AboutData,
  Event as ClubEvent,
  Announcement,
  OfficeBearer as TeamMember,
  GalleryItem,
  ContactInfo,
  ContactMessage,
  Settings,
} from "@/types";

// ==========================================
// Caching Helpers for SWR Pattern
// ==========================================
const getCachedData = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(`sh_club_cache_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.warn("Failed to retrieve from localStorage cache:", e);
    return null;
  }
};

const setCachedData = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`sh_club_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to store in localStorage cache:", e);
  }
};

// ==========================================
// Generic CRUD Helpers for Admin Portal
// ==========================================

export async function createDocument(collectionName: string, data: DocumentData): Promise<string> {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument(collectionName: string, id: string, data: DocumentData): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// ==========================================
// 1. Homepage Services
// ==========================================

export async function getHomepageData(): Promise<HomepageData | null> {
  const docRef = doc(db, "homepage", "main");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as HomepageData;
  }
  return null;
}

export function subscribeHomepageData(callback: (data: HomepageData | null) => void) {
  const cached = getCachedData<HomepageData>("homepage");
  if (cached) callback(cached);

  const docRef = doc(db, "homepage", "main");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as HomepageData;
      setCachedData("homepage", data);
      callback(data);
    } else {
      callback(null);
    }
  });
}

// ==========================================
// 2. About Services
// ==========================================

export async function getAboutData(): Promise<AboutData | null> {
  const docRef = doc(db, "about", "main");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as AboutData;
  }
  return null;
}

export function subscribeAboutData(callback: (data: AboutData | null) => void) {
  const cached = getCachedData<AboutData>("about");
  if (cached) callback(cached);

  const docRef = doc(db, "about", "main");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as AboutData;
      setCachedData("about", data);
      callback(data);
    } else {
      callback(null);
    }
  });
}

// ==========================================
// 3. Events Services
// ==========================================

export async function getEvents(): Promise<ClubEvent[]> {
  const colRef = collection(db, "events");
  const q = query(colRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  const events: ClubEvent[] = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() } as ClubEvent);
  });
  return events;
}

export async function getUpcomingEvents(): Promise<ClubEvent[]> {
  const colRef = collection(db, "events");
  const q = query(
    colRef,
    where("status", "==", "upcoming"),
    orderBy("date", "asc")
  );
  const querySnapshot = await getDocs(q);
  const events: ClubEvent[] = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() } as ClubEvent);
  });
  return events;
}

export async function getEventById(id: string): Promise<ClubEvent | null> {
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ClubEvent;
  }
  return null;
}

export function subscribeEvents(callback: (data: ClubEvent[]) => void) {
  const cached = getCachedData<ClubEvent[]>("events");
  if (cached) callback(cached);

  const colRef = collection(db, "events");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const events: ClubEvent[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as ClubEvent);
    });
    setCachedData("events", events);
    callback(events);
  });
}

// ==========================================
// 4. Announcements Services
// ==========================================

export async function getAnnouncements(): Promise<Announcement[]> {
  const colRef = collection(db, "announcements");
  const q = query(colRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  const announcements: Announcement[] = [];
  querySnapshot.forEach((doc) => {
    announcements.push({ id: doc.id, ...doc.data() } as Announcement);
  });
  return announcements;
}

export function subscribeAnnouncements(callback: (data: Announcement[]) => void) {
  const cached = getCachedData<Announcement[]>("announcements");
  if (cached) callback(cached);

  const colRef = collection(db, "announcements");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const announcements: Announcement[] = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() } as Announcement);
    });
    setCachedData("announcements", announcements);
    callback(announcements);
  });
}

// ==========================================
// 5. Office Bearers / Team Services
// ==========================================

export async function getTeamMembers(): Promise<TeamMember[]> {
  const colRef = collection(db, "officeBearers");
  const q = query(colRef, orderBy("priorityOrder", "asc"));
  const querySnapshot = await getDocs(q);
  const members: TeamMember[] = [];
  querySnapshot.forEach((doc) => {
    members.push({ id: doc.id, ...doc.data() } as TeamMember);
  });
  return members;
}

export function subscribeTeamMembers(callback: (data: TeamMember[]) => void) {
  const cached = getCachedData<TeamMember[]>("team");
  if (cached) callback(cached);

  const colRef = collection(db, "officeBearers");
  const q = query(colRef, orderBy("priorityOrder", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const members: TeamMember[] = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() } as TeamMember);
    });
    setCachedData("team", members);
    callback(members);
  });
}

// ==========================================
// 6. Gallery Services
// ==========================================

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const colRef = collection(db, "gallery");
  const q = query(colRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  const items: GalleryItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as GalleryItem);
  });
  return items;
}

export function subscribeGalleryImages(callback: (data: GalleryItem[]) => void) {
  const cached = getCachedData<GalleryItem[]>("gallery");
  if (cached) callback(cached);

  const colRef = collection(db, "gallery");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
    setCachedData("gallery", items);
    callback(items);
  });
}

// ==========================================
// 7. Settings Services
// ==========================================

export async function getSettings(): Promise<Settings | null> {
  const docRef = doc(db, "settings", "general");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as Settings;
  }
  return null;
}

export function subscribeSettings(callback: (data: Settings | null) => void) {
  const cached = getCachedData<Settings>("settings");
  if (cached) callback(cached);

  const docRef = doc(db, "settings", "general");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as Settings;
      setCachedData("settings", data);
      callback(data);
    } else {
      callback(null);
    }
  });
}

// ==========================================
// 8. Contact Services
// ==========================================

export async function getContactInfo(): Promise<ContactInfo | null> {
  const docRef = doc(db, "contact", "info");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as ContactInfo;
  }
  return null;
}

export function subscribeContactInfo(callback: (data: ContactInfo | null) => void) {
  const cached = getCachedData<ContactInfo>("contact");
  if (cached) callback(cached);

  const docRef = doc(db, "contact", "info");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as ContactInfo;
      setCachedData("contact", data);
      callback(data);
    } else {
      callback(null);
    }
  });
}

export async function submitContactMessage(message: Omit<ContactMessage, "id" | "timestamp">): Promise<void> {
  const colRef = collection(db, "contactMessages");
  await addDoc(colRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
}
