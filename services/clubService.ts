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
  const docRef = doc(db, "homepage", "main");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as HomepageData);
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
  const docRef = doc(db, "about", "main");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AboutData);
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
  const colRef = collection(db, "events");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const events: ClubEvent[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as ClubEvent);
    });
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
  const colRef = collection(db, "announcements");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const announcements: Announcement[] = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() } as Announcement);
    });
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
  const colRef = collection(db, "officeBearers");
  const q = query(colRef, orderBy("priorityOrder", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const members: TeamMember[] = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() } as TeamMember);
    });
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
  const colRef = collection(db, "gallery");
  const q = query(colRef, orderBy("date", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
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
  const docRef = doc(db, "settings", "general");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Settings);
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
  const docRef = doc(db, "contact", "info");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ContactInfo);
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
