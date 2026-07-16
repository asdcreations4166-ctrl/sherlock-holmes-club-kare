"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from "firebase/firestore";

type LogActionFn = (action: string, targetCol: string, targetId: string) => Promise<void>;

const uploadToImgbb = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("Imgbb API Key is missing. Please add NEXT_PUBLIC_IMGBB_API_KEY in your .env.local file.");
  }
  
  onProgress(20);
  const formData = new FormData();
  formData.append("image", file);
  
  onProgress(50);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  
  onProgress(80);
  if (!response.ok) {
    throw new Error("Upload request failed");
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Upload rejected by Imgbb");
  }
  
  onProgress(100);
  return data.data.url;
};

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Compass,
  Calendar,
  Bell,
  Users,
  Camera,
  Download,
  Mail,
  Settings as SettingsIcon,
  UserCheck,
  History,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Loader2,
  Eye,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { HomepageData, AboutData, Event as ClubEvent, Announcement, TeamMember, GalleryItem, ContactInfo, Settings, AdminUser, ActivityLog } from "@/types";

// ==========================================
// 1. Role Module Permission Helper
// ==========================================
type ModuleName =
  | "dashboard"
  | "homepage"
  | "about"
  | "events"
  | "announcements"
  | "team"
  | "gallery"
  | "downloads"
  | "contact"
  | "settings"
  | "adminUsers"
  | "activityLogs";

function hasPermission(role: string, module: ModuleName): boolean {
  const normalized = (role || "").toLowerCase().replace(/\s+/g, "");
  if (normalized === "superadmin" || normalized === "admin") return true;
  if (normalized === "mediateam") return ["dashboard", "gallery"].includes(module);
  if (normalized === "contenteditor") return ["dashboard", "homepage", "about", "announcements"].includes(module);
  if (normalized === "president") return ["dashboard", "events", "team", "homepage"].includes(module);
  if (normalized === "facultycoordinator" || normalized === "studentcoordinator") {
    return ["dashboard", "events", "announcements", "team", "downloads"].includes(module);
  }
  if (normalized === "vicepresident" || normalized === "secretary") {
    return ["dashboard", "events", "announcements", "team", "gallery", "contact"].includes(module);
  }
  return ["dashboard"].includes(module);
}

// ==========================================
// 2. Client-Side Image Compression Helper
// ==========================================
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7
        );
      };
    };
  });
};

export default function AdminDashboardPage() {
  const { user, adminProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ModuleName>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Common lists for statistics/tables
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // ==========================================
  // Real-Time Subscriptions for Lists
  // ==========================================
  useEffect(() => {
    if (!user) return;

    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      const items: ClubEvent[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as ClubEvent));
      setEvents(items);
    });

    const unsubAnnouncements = onSnapshot(collection(db, "announcements"), (snap) => {
      const items: Announcement[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as Announcement));
      setAnnouncements(items);
    });

    const unsubTeam = onSnapshot(collection(db, "officeBearers"), (snap) => {
      const items: TeamMember[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as TeamMember));
      setTeam(items);
    });

    const unsubGallery = onSnapshot(collection(db, "gallery"), (snap) => {
      const items: GalleryItem[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as GalleryItem));
      setGallery(items);
    });

    const unsubLogs = onSnapshot(query(collection(db, "activityLogs"), orderBy("timestamp", "desc")), (snap) => {
      const items: ActivityLog[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as ActivityLog));
      setLogs(items);
    });

    const unsubAdmins = onSnapshot(collection(db, "adminUsers"), (snap) => {
      const items: AdminUser[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as AdminUser));
      setAdmins(items);
    });

    return () => {
      unsubEvents();
      unsubAnnouncements();
      unsubTeam();
      unsubGallery();
      unsubLogs();
      unsubAdmins();
    };
  }, [user]);

  // Log action helper
  const logAction = async (action: string, targetCol: string, targetId: string) => {
    try {
      await addDoc(collection(db, "activityLogs"), {
        adminUid: user?.uid || "",
        adminEmail: user?.email || "",
        action,
        targetCollection: targetCol,
        targetId,
        timestamp: new Date(),
      });
    } catch (e) {
      console.error("Failed to log activity log", e);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully.");
  };

  // Nav items configuration
  const sidebarItems = [
    { id: "dashboard" as ModuleName, label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "homepage" as ModuleName, label: "Home Page", icon: <HomeIcon className="h-4 w-4" /> },
    { id: "about" as ModuleName, label: "About Page", icon: <Compass className="h-4 w-4" /> },
    { id: "events" as ModuleName, label: "Events", icon: <Calendar className="h-4 w-4" /> },
    { id: "announcements" as ModuleName, label: "Announcements", icon: <Bell className="h-4 w-4" /> },
    { id: "team" as ModuleName, label: "Team", icon: <Users className="h-4 w-4" /> },
    { id: "gallery" as ModuleName, label: "Gallery", icon: <Camera className="h-4 w-4" /> },
    { id: "downloads" as ModuleName, label: "Downloads", icon: <Download className="h-4 w-4" /> },
    { id: "contact" as ModuleName, label: "Contact Info", icon: <Mail className="h-4 w-4" /> },
    { id: "settings" as ModuleName, label: "Settings", icon: <SettingsIcon className="h-4 w-4" /> },
    { id: "adminUsers" as ModuleName, label: "Admin Users", icon: <UserCheck className="h-4 w-4" /> },
    { id: "activityLogs" as ModuleName, label: "Activity Logs", icon: <History className="h-4 w-4" /> },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => hasPermission(adminProfile?.role || "", item.id));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex font-sans admin-dashboard">
        {/* ==========================================
            Sidebar Component (Collapsible)
           ========================================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white border border-border/40 shrink-0">
                  <img src="/logo.jpg" alt="SH Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-bold leading-tight">Admin Console</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">KARE Campus</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-secondary/40 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {filteredSidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </aside>

        {/* ==========================================
            Main Panel Wrapper
           ========================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar Navigation */}
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-secondary/40 rounded-lg text-muted-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative max-w-xs w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Global search..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl border-border bg-background focus:ring-primary text-foreground"
                />
              </div>
            </div>

            {/* Profile Dropdown & Theme Toggle */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground">{adminProfile?.displayName || "Admin"}</span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                  {adminProfile?.role || "superadmin"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading text-sm font-bold shrink-0">
                {(adminProfile?.displayName || "A")[0]}
              </div>
            </div>
          </header>

          {/* Tab Viewport */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardHomeTab
                events={events}
                announcements={announcements}
                team={team}
                gallery={gallery}
                logs={logs}
              />
            )}
            {activeTab === "homepage" && <HomepageTab logAction={logAction} />}
            {activeTab === "about" && <AboutTab logAction={logAction} />}
            {activeTab === "events" && (
              <EventsTab events={events} logAction={logAction} search={globalSearch} />
            )}
            {activeTab === "announcements" && (
              <AnnouncementsTab announcements={announcements} logAction={logAction} search={globalSearch} />
            )}
            {activeTab === "team" && <TeamTab team={team} logAction={logAction} search={globalSearch} />}
            {activeTab === "gallery" && <GalleryTab gallery={gallery} logAction={logAction} />}
            {activeTab === "downloads" && <DownloadsTab logAction={logAction} />}
            {activeTab === "contact" && <ContactTab logAction={logAction} />}
            {activeTab === "settings" && <SettingsTab logAction={logAction} />}
            {activeTab === "adminUsers" && <AdminUsersTab admins={admins} logAction={logAction} />}
            {activeTab === "activityLogs" && <ActivityLogsTab logs={logs} />}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// TAB: DASHBOARD HOME
// ============================================================================
interface DashboardHomeProps {
  events: ClubEvent[];
  announcements: Announcement[];
  team: TeamMember[];
  gallery: GalleryItem[];
  logs: ActivityLog[];
}
function DashboardHomeTab({ events, announcements, team, gallery, logs }: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-heading text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-xs text-muted-foreground">Real-time status of your university club portal assets.</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", count: events.length, icon: <Calendar className="h-5 w-5 text-primary" /> },
          { label: "Announcements", count: announcements.length, icon: <Bell className="h-5 w-5 text-emerald-500" /> },
          { label: "Gallery Assets", count: gallery.length, icon: <Camera className="h-5 w-5 text-amber-500" /> },
          { label: "Office Bearers", count: team.filter((m) => m.division === "bearers").length, icon: <Users className="h-5 w-5 text-indigo-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="p-5 border border-slate-200/80 bg-white flex items-center justify-between rounded-2xl shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent updates */}
        <Card className="lg:col-span-2 p-6 border border-slate-200 bg-white rounded-3xl space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Recent Audit Logs</h3>
          <div className="space-y-3.5 max-h-96 overflow-y-auto">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex justify-between items-start text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800">{log.action}</span>
                  <p className="text-slate-400 text-[10px]">{log.adminEmail}</p>
                </div>
                <span className="text-slate-400 shrink-0 font-medium">
                  {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* System parameters */}
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Portal Systems</h3>
          <div className="space-y-4 text-xs font-medium">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Firebase Auth</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Firestore DB</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Storage Cloud</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Sync Status</span>
              <span className="text-primary animate-pulse">Connected</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// TAB: HOMEPAGE MANAGEMENT
// ============================================================================
function HomepageTab({ logAction }: { logAction: LogActionFn }) {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "homepage", "main"), (snap) => {
      if (snap.exists()) {
        setData(snap.data() as HomepageData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "homepage", "main"), data);
      await logAction("Updated Homepage CMS Text", "homepage", "main");
      toast.success("Homepage content saved and synced successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full bg-slate-200" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">Home Page Content Management</h1>
        <p className="text-xs text-slate-500">Edit elements visible on the main landing banner and highlights preview.</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hero Tagline</label>
              <Input
                value={data?.heroTagline || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, heroTagline: e.target.value } : null)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hero Title Banner</label>
              <Input
                value={data?.heroTitle || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, heroTitle: e.target.value } : null)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hero Subtitle / Description</label>
            <Textarea
              value={data?.heroDescription || ""}
              onChange={(e) => setData(prev => prev ? { ...prev, heroDescription: e.target.value } : null)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">About Section Preview Snippet</label>
            <Textarea
              value={data?.aboutPreview || ""}
              onChange={(e) => setData(prev => prev ? { ...prev, aboutPreview: e.target.value } : null)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Sync To Landing Page</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: ABOUT MANAGEMENT
// ============================================================================
function AboutTab({ logAction }: { logAction: LogActionFn }) {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "about", "main"), (snap) => {
      if (snap.exists()) {
        setData(snap.data() as AboutData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "about", "main"), data);
      await logAction("Updated About Club text and objectives", "about", "main");
      toast.success("About page parameters synchronized successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleObjectiveChange = (index: number, val: string) => {
    if (!data) return;
    const newObjs = [...data.objectives];
    newObjs[index] = val;
    setData({ ...data, objectives: newObjs });
  };

  const addObjective = () => {
    if (!data) return;
    setData({ ...data, objectives: [...data.objectives, ""] });
  };

  const deleteObjective = (index: number) => {
    if (!data) return;
    setData({ ...data, objectives: data.objectives.filter((_, i) => i !== index) });
  };

  if (loading) return <Skeleton className="h-64 w-full bg-slate-200" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">About Page CMS</h1>
        <p className="text-xs text-slate-500">Edit the detailed campus overview, mission, and strategic objectives.</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Club Overview Description</label>
            <Textarea
              value={data?.description || ""}
              onChange={(e) => setData(prev => prev ? { ...prev, description: e.target.value } : null)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Club Vision Statement</label>
              <Textarea
                value={data?.vision || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, vision: e.target.value } : null)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Club Mission Statement</label>
              <Textarea
                value={data?.mission || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, mission: e.target.value } : null)}
                rows={4}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Key Objectives List</label>
              <Button type="button" onClick={addObjective} size="sm" variant="outline" className="flex items-center gap-1.5 text-xs rounded-xl">
                <Plus className="h-3 w-3" />
                <span>Add Objective</span>
              </Button>
            </div>
            <div className="space-y-2">
              {data?.objectives.map((obj, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={obj}
                    onChange={(e) => handleObjectiveChange(i, e.target.value)}
                    required
                    placeholder={`Objective #${i + 1}`}
                  />
                  <Button type="button" size="icon" variant="ghost" onClick={() => deleteObjective(i)} className="text-rose-500 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Save About parameters</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: EVENT MANAGEMENT (CRUD)
// ============================================================================
interface EventsTabProps {
  events: ClubEvent[];
  logAction: LogActionFn;
  search: string;
}
function EventsTab({ events, logAction, search }: EventsTabProps) {
  const [editingEvent, setEditingEvent] = useState<Partial<ClubEvent> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (event: ClubEvent) => {
    setEditingEvent(event);
  };

  const handleCreate = () => {
    setEditingEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "workshops",
      status: "upcoming",
      rules: [],
      registrationOpen: false,
      registrationLink: "",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;
    try {
      setUploadProgress(10);
      const compressed = await compressImage(file);
      const downloadUrl = await uploadToImgbb(compressed, setUploadProgress);
      setEditingEvent({ ...editingEvent, image: downloadUrl });
      toast.success("Event poster processed and uploaded!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Upload failed");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      setSaving(true);
      const docData = { ...editingEvent };
      if (editingEvent.id) {
        await updateDoc(doc(db, "events", editingEvent.id), docData);
        await logAction(`Updated Event record: ${editingEvent.title}`, "events", editingEvent.id);
        toast.success("Event updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "events"), {
          ...docData,
          createdAt: serverTimestamp(),
        });
        await logAction(`Created Event record: ${editingEvent.title}`, "events", docRef.id);
        toast.success("Event created successfully!");
      }
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Failed to save event: ${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      await logAction(`Deleted Event record: ${name}`, "events", id);
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Failed to delete event: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-bold text-slate-800">Event Registry CMS</h1>
          <p className="text-xs text-slate-500">Edit, create, and manage schedule listings for campus workshops.</p>
        </div>
        {!editingEvent && (
          <Button onClick={handleCreate} className="bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        )}
      </div>

      {editingEvent ? (
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-3xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Title</label>
                <Input
                  value={editingEvent.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                <select
                  value={editingEvent.category || "workshops"}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as ClubEvent["category"] })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
                >
                  <option value="workshops">Workshops</option>
                  <option value="inductions">Inductions</option>
                  <option value="competitions">Competitions</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Description</label>
              <Textarea
                value={editingEvent.description || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date (e.g. Oct 24, 2026)</label>
                <Input
                  value={editingEvent.date || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Time (e.g. 10:00 AM)</label>
                <Input
                  value={editingEvent.time || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Venue / Location</label>
                <Input
                  value={editingEvent.location || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Registration Link</label>
                <Input
                  value={editingEvent.registrationLink || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })}
                  placeholder="https://docs.google.com/forms/..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</label>
                <select
                  value={editingEvent.status || "upcoming"}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as ClubEvent["status"] })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingEvent.registrationOpen || false}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registrationOpen: e.target.checked })}
                  className="rounded text-primary border-border focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-700">Allow Online Registrations</span>
              </label>
            </div>

            {/* Poster Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Event Poster Image</label>
              <div className="flex items-center gap-4">
                {editingEvent.image && (
                  <img src={editingEvent.image} alt="Poster preview" className="h-20 w-32 object-cover rounded-xl border border-slate-200" />
                )}
                <div className="flex flex-col gap-1 flex-1">
                  <Input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs" />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Sync Event doc</span>
              </Button>
              <Button type="button" onClick={() => setEditingEvent(null)} variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-slate-200">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <EmptyState title="No Events Available" description="Register a new student schedule using the button above." icon={<Calendar className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <Card key={item.id} className="p-6 border border-slate-200 bg-white rounded-3xl shadow-2xs flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {item.category || "other"}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-800 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(item)} size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-slate-50">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(item.id, item.title)} size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:bg-slate-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB: ANNOUNCEMENT MANAGEMENT (CRUD)
// ============================================================================
interface AnnouncementsTabProps {
  announcements: Announcement[];
  logAction: LogActionFn;
  search: string;
}
function AnnouncementsTab({ announcements, logAction, search }: AnnouncementsTabProps) {
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (ann: Announcement) => setEditing(ann);
  const handleCreate = () => setEditing({ title: "", content: "", date: "", category: "general", important: false });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    try {
      setSaving(true);
      const docData = { ...editing };
      if (editing.id) {
        await updateDoc(doc(db, "announcements", editing.id), docData);
        await logAction(`Updated Announcement: ${editing.title}`, "announcements", editing.id);
        toast.success("Announcement synchronized!");
      } else {
        const docRef = await addDoc(collection(db, "announcements"), { ...docData, createdAt: serverTimestamp() });
        await logAction(`Created Announcement: ${editing.title}`, "announcements", docRef.id);
        toast.success("Announcement published!");
      }
      setEditing(null);
    } catch (err) {
      toast.error("Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      await logAction(`Deleted Announcement: ${title}`, "announcements", id);
      toast.success("Announcement deleted successfully!");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Deletion failed: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-bold text-slate-800">Circulars & Announcements</h1>
          <p className="text-xs text-slate-500">Edit, publish, and delete official club circulars and notification feeds.</p>
        </div>
        {!editing && (
          <Button onClick={handleCreate} className="bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Create Circular</span>
          </Button>
        )}
      </div>

      {editing ? (
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Announcement Title</label>
              <Input
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Content Narrative</label>
              <Textarea
                value={editing.content || ""}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Publish Date (e.g. Oct 20, 2026)</label>
                <Input
                  value={editing.date || ""}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                <select
                  value={editing.category || "general"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as Announcement["category"] })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="event">Events</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editing.important || false}
                  onChange={(e) => setEditing({ ...editing, important: e.target.checked })}
                  className="rounded text-primary border-border focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-700">Flag as Important / Urgent</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Publish Circular</span>
              </Button>
              <Button type="button" onClick={() => setEditing(null)} variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-slate-200">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <EmptyState title="No Circulars Found" description="Use the button above to publish announcements." icon={<Bell className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {item.category || "general"}
                      </span>
                      {item.important && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.content}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-medium">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">{item.date}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(item)} size="icon" variant="ghost" className="h-8 w-8 text-primary">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(item.id, item.title)} size="icon" variant="ghost" className="h-8 w-8 text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB: TEAM Roster MANAGEMENT
// ============================================================================
interface TeamTabProps {
  team: TeamMember[];
  logAction: LogActionFn;
  search: string;
}
function TeamTab({ team, logAction, search }: TeamTabProps) {
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (mem: TeamMember) => setEditing(mem);
  const handleCreate = () =>
    setEditing({
      name: "",
      role: "",
      email: "",
      linkedin: "",
      department: "",
      division: "bearers",
      priorityOrder: 10,
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      setUploadProgress(10);
      const compressed = await compressImage(file);
      const downloadUrl = await uploadToImgbb(compressed, setUploadProgress);
      setEditing({ ...editing, image: downloadUrl });
      toast.success("Profile photo processed and uploaded!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Upload failed");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    try {
      setSaving(true);
      const docData = { ...editing };
      if (editing.id) {
        await updateDoc(doc(db, "officeBearers", editing.id), docData);
        await logAction(`Updated Team Member Profile: ${editing.name}`, "officeBearers", editing.id);
        toast.success("Roster record synchronized!");
      } else {
        const docRef = await addDoc(collection(db, "officeBearers"), { ...docData, createdAt: serverTimestamp() });
        await logAction(`Created Team Member Profile: ${editing.name}`, "officeBearers", docRef.id);
        toast.success("Member roster profile created!");
      }
      setEditing(null);
    } catch (err) {
      toast.error("Failed to sync profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "officeBearers", id));
      await logAction(`Deleted Team Member: ${name}`, "officeBearers", id);
      toast.success("Profile removed successfully!");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Deletion failed: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-bold text-slate-800">Team Committee Registry</h1>
          <p className="text-xs text-slate-500">Edit, add, and manage advisors, coordinators, and executive division heads.</p>
        </div>
        {!editing && (
          <Button onClick={handleCreate} className="bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        )}
      </div>

      {editing ? (
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                <Input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Role Name (e.g. Advisor)</label>
                <Input
                  value={editing.role || ""}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Division Category</label>
                <select
                  value={editing.division || "bearers"}
                  onChange={(e) => setEditing({ ...editing, division: e.target.value as TeamMember["division"] })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
                >
                  <option value="advisors">Faculty Advisors</option>
                  <option value="coordinators">Student Coordinators</option>
                  <option value="bearers">Office Bearers</option>
                  <option value="committee">Executive Committee</option>
                  <option value="alumni">Past Committees / Alumni</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Display Order Priority (number)</label>
                <Input
                  type="number"
                  value={editing.priorityOrder || 10}
                  onChange={(e) => setEditing({ ...editing, priorityOrder: parseInt(e.target.value) || 10 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Academic Dept</label>
                <Input
                  value={editing.department || ""}
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                  placeholder="e.g. CSE"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Academic Year</label>
                <Input
                  value={editing.academicYear || ""}
                  onChange={(e) => setEditing({ ...editing, academicYear: e.target.value })}
                  placeholder="e.g. 2025-2026"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                <Input
                  type="email"
                  value={editing.email || ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  placeholder="john@kare.edu.in"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">LinkedIn URL</label>
              <Input
                value={editing.linkedin || ""}
                onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {/* Photo upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Avatar Profile Photo</label>
              <div className="flex items-center gap-4">
                {editing.image && (
                  <img src={editing.image} alt="Avatar Preview" className="h-14 w-14 rounded-full object-cover border border-slate-200" />
                )}
                <div className="flex flex-col gap-1 flex-1">
                  <Input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs" />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Sync profile</span>
              </Button>
              <Button type="button" onClick={() => setEditing(null)} variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-slate-200">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <EmptyState title="No Committee Members" description="Roster database is empty. Add a member profile using the button above." icon={<Users className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <Card key={item.id} className="p-5 border border-slate-200 bg-white rounded-3xl shadow-2xs flex flex-col justify-between items-center text-center gap-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Users className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800 leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wide mt-0.5">{item.role}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{item.division}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-3 border-t border-slate-100 justify-center">
                    <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="rounded-xl text-xs font-bold flex items-center gap-1">
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                    <Button onClick={() => handleDelete(item.id, item.name)} size="sm" variant="ghost" className="rounded-xl text-rose-500 hover:bg-rose-50 flex items-center gap-1 font-semibold">
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB: GALLERY MANAGEMENT
// ============================================================================
function GalleryTab({ gallery, logAction }: { gallery: GalleryItem[]; logAction: LogActionFn }) {
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newImage, setNewImage] = useState<{ title: string; category: string; imageUrl: string }>({
    title: "",
    category: "workshops",
    imageUrl: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadProgress(10);
      const compressed = await compressImage(file);
      const downloadUrl = await uploadToImgbb(compressed, setUploadProgress);
      setNewImage(prev => ({ ...prev, imageUrl: downloadUrl }));
      toast.success("Gallery image processed and uploaded!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Upload failed");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newImage.imageUrl) {
      toast.error("Please upload an image first.");
      return;
    }
    try {
      setSaving(true);
      const docRef = await addDoc(collection(db, "gallery"), {
        ...newImage,
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp(),
      });
      await logAction(`Uploaded Gallery Image: ${newImage.title}`, "gallery", docRef.id);
      toast.success("Gallery item published successfully!");
      setNewImage({ title: "", category: "workshops", imageUrl: "" });
    } catch (err) {
      toast.error("Failed to add image");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      await logAction(`Deleted Gallery Image: ${title}`, "gallery", id);
      toast.success("Gallery item deleted!");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Failed to delete gallery item: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">Gallery Media Cabinet</h1>
        <p className="text-xs text-slate-500">Upload pictures and sort them into workshops, inductions, or competitions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Upload Media Item</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Image Title</label>
              <Input
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                required
                placeholder="e.g. Inauguration Ceremony"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category Album</label>
              <select
                value={newImage.category}
                onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
              >
                <option value="workshops">Workshops</option>
                <option value="inductions">Inductions</option>
                <option value="competitions">Competitions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Upload Image File</label>
              <div className="flex flex-col gap-1">
                <Input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs" />
                {uploadProgress > 0 && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>
            </div>

            {newImage.imageUrl && (
              <img src={newImage.imageUrl} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-slate-200" />
            )}

            <Button type="submit" disabled={saving || !newImage.imageUrl} className="w-full bg-primary text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              <span>Sync to Gallery</span>
            </Button>
          </form>
        </Card>

        {/* Gallery Preview Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Gallery Listing</h3>
          {gallery.length === 0 ? (
            <EmptyState title="No Media Uploaded" description="Upload pictures from the sidebar panel form." icon={<Camera className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((item) => (
                <Card key={item.id} className="border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
                  <img src={item.imageUrl} alt={item.title} className="w-full aspect-video object-cover" />
                  <div className="p-4 flex justify-between items-center gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">{item.category}</span>
                      <h4 className="font-heading font-bold text-xs text-slate-800 line-clamp-1">{item.title}</h4>
                    </div>
                    <Button onClick={() => handleDelete(item.id, item.title)} size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:bg-rose-50 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TAB: CONTACT DETAILS
// ============================================================================
function ContactTab({ logAction }: { logAction: LogActionFn }) {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "contact", "info"), (snap) => {
      if (snap.exists()) {
        setData(snap.data() as ContactInfo);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "contact", "info"), data);
      await logAction("Updated Club Contact details", "contact", "info");
      toast.success("Contact details updated successfully!");
    } catch (err) {
      toast.error("Failed to sync contact info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full bg-slate-200" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">Contact Details</h1>
        <p className="text-xs text-slate-500">Edit address coordinates, email helplines, and social media handles.</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Office Location Address</label>
            <Textarea
              value={data?.officeLocation || ""}
              onChange={(e) => setData(prev => prev ? { ...prev, officeLocation: e.target.value } : null)}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
              <Input
                type="email"
                value={data?.emailAddress || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, emailAddress: e.target.value } : null)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone Helpline</label>
              <Input
                value={data?.phoneHelpline || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, phoneHelpline: e.target.value } : null)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">LinkedIn URL</label>
              <Input
                value={data?.socials?.linkedin || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, socials: { ...prev.socials, linkedin: e.target.value } } : null)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">GitHub Organization</label>
              <Input
                value={data?.socials?.github || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, socials: { ...prev.socials, github: e.target.value } } : null)}
              />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Sync details</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: WEBSITE SETTINGS
// ============================================================================
function SettingsTab({ logAction }: { logAction: LogActionFn }) {
  const [data, setData] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (snap) => {
      if (snap.exists()) {
        setData(snap.data() as Settings);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "general"), data);
      await logAction("Updated general website config settings", "settings", "general");
      toast.success("General settings saved and synced successfully!");
    } catch (err) {
      toast.error("Failed to sync settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full bg-slate-200" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">Website Global Configuration</h1>
        <p className="text-xs text-slate-500">Configure global website name, registration state, maintenance modes, and logos.</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Club Title Name</label>
              <Input
                value={data?.clubName || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, clubName: e.target.value } : null)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Institution / University</label>
              <Input
                value={data?.universityName || ""}
                onChange={(e) => setData(prev => prev ? { ...prev, universityName: e.target.value } : null)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Online Registration Form Link</label>
            <Input
              value={data?.registrationLink || ""}
              onChange={(e) => setData(prev => prev ? { ...prev, registrationLink: e.target.value } : null)}
              placeholder="https://docs.google.com/forms/d/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data?.allowRegistrations || false}
                onChange={(e) => setData(prev => prev ? { ...prev, allowRegistrations: e.target.checked } : null)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-700">Allow Online Registrations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data?.maintenanceMode || false}
                onChange={(e) => setData(prev => prev ? { ...prev, maintenanceMode: e.target.checked } : null)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-700">Enable Maintenance Lock</span>
            </label>
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Sync Settings</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: ADMIN MANAGEMENT (ROLE ASSIGNMENT)
// ============================================================================
interface AdminUsersTabProps {
  admins: AdminUser[];
  logAction: LogActionFn;
}
function AdminUsersTab({ admins, logAction }: AdminUsersTabProps) {
  const [editing, setEditing] = useState<Partial<AdminUser> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = (adm: AdminUser) => setEditing(adm);
  const handleCreate = () => setEditing({ uid: "", email: "", displayName: "", role: "editor" });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing || !editing.uid) {
      toast.error("Please supply a valid User Auth ID (UID).");
      return;
    }
    try {
      setSaving(true);
      const docData = {
        ...editing,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "adminUsers", editing.uid), docData);
      await logAction(`Created/Updated Admin Privileges for: ${editing.email}`, "adminUsers", editing.uid);
      toast.success("Admin roles saved successfully!");
      setEditing(null);
    } catch (err) {
      toast.error("Failed to sync admin user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    try {
      await deleteDoc(doc(db, "adminUsers", id));
      await logAction(`Deleted Admin User Permissions: ${email}`, "adminUsers", id);
      toast.success("Admin permissions revoked successfully!");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(`Revoke failed: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-bold text-slate-800">Admin Roster CMS</h1>
          <p className="text-xs text-slate-500">Configure administrative access roles (Super Admin, Coordinator, Media Team).</p>
        </div>
        {!editing && (
          <Button onClick={handleCreate} className="bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add Admin permissions</span>
          </Button>
        )}
      </div>

      {editing ? (
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs max-w-xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">User UID (from Firebase Auth)</label>
              <Input
                value={editing.uid || ""}
                onChange={(e) => setEditing({ ...editing, uid: e.target.value })}
                required
                placeholder="Paste User UID here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Display Name</label>
                <Input
                  value={editing.displayName || ""}
                  onChange={(e) => setEditing({ ...editing, displayName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Admin Email</label>
                <Input
                  type="email"
                  value={editing.email || ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Role Assignment</label>
              <select
                value={editing.role || "editor"}
                onChange={(e) => setEditing({ ...editing, role: e.target.value as AdminUser["role"] })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white"
              >
                <option value="superadmin">Super Admin</option>
                <option value="admin">Administrator</option>
                <option value="editor">Content Editor</option>
                <option value="mediateam">Media Team</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Assign Roles</span>
              </Button>
              <Button type="button" onClick={() => setEditing(null)} variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-slate-200">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {admins.length === 0 ? (
            <EmptyState title="No Admins Assigned" description="Use the button above to assign admin privileges." icon={<UserCheck className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="space-y-3">
              {admins.map((adm) => (
                <div key={adm.uid} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-sm text-slate-800">{adm.displayName}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Email: {adm.email} | UID: {adm.uid}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-medium">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {adm.role}
                    </span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(adm)} size="icon" variant="ghost" className="h-8 w-8 text-primary">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(adm.uid, adm.email)} size="icon" variant="ghost" className="h-8 w-8 text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB: AUDIT LOGS DISPLAY
// ============================================================================
function ActivityLogsTab({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">System Activity Audit Log</h1>
        <p className="text-xs text-slate-500">Examine full history of edits, creations, and security logs performed on KARE portal.</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs">
        <div className="space-y-4">
          {logs.length === 0 ? (
            <EmptyState title="No Activity Logged" description="Database operations logs will appear here." icon={<History className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-500">
                <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin Email</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Collection</th>
                    <th className="py-3 px-4">Record ID</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100/50 hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-sans text-slate-400">
                        {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : ""}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{log.adminEmail}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-bold">{log.action}</td>
                      <td className="py-3.5 px-4 font-mono text-primary">{log.targetCollection}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{log.targetId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: DOWNLOADS MANAGEMENT
// ============================================================================
interface DownloadItem {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  createdAt: Timestamp | FieldValue | Date;
}

function DownloadsTab({ logAction }: { logAction: LogActionFn }) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [pastedUrl, setPastedUrl] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "downloads"), (snap) => {
      const items: DownloadItem[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as DownloadItem));
      setDownloads(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newTitle) {
      toast.error("Please enter a title for the download document first.");
      return;
    }
    try {
      setSaving(true);
      const storageRef = ref(storage, `downloads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100);
        },
        (err) => {
          toast.error("Upload failed");
          setSaving(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const sizeKb = `${Math.round(file.size / 1024)} KB`;
          const ext = file.name.split(".").pop() || "PDF";
          const docRef = await addDoc(collection(db, "downloads"), {
            title: newTitle,
            fileUrl: downloadUrl,
            fileType: ext.toUpperCase(),
            fileSize: sizeKb,
            createdAt: serverTimestamp(),
          });
          await logAction(`Uploaded Downloadable Document: ${newTitle}`, "downloads", docRef.id);
          toast.success("Document published to downloads!");
          setNewTitle("");
          setUploadProgress(0);
          setSaving(false);
        }
      );
    } catch (err) {
      toast.error("File processing failed");
      setSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!newTitle) {
      toast.error("Please enter a title for the document first.");
      return;
    }
    if (!pastedUrl) {
      toast.error("Please enter a document URL.");
      return;
    }
    try {
      setSaving(true);
      const ext = pastedUrl.split(".").pop()?.split("?")[0] || "PDF";
      const docRef = await addDoc(collection(db, "downloads"), {
        title: newTitle,
        fileUrl: pastedUrl,
        fileType: ext.toUpperCase().substring(0, 4),
        fileSize: "Link Reference",
        createdAt: serverTimestamp(),
      });
      await logAction(`Added Downloadable Link: ${newTitle}`, "downloads", docRef.id);
      toast.success("Document link published!");
      setNewTitle("");
      setPastedUrl("");
    } catch (err) {
      toast.error("Failed to add document link");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete downloadable file: ${title}?`)) {
      try {
        await deleteDoc(doc(db, "downloads", id));
        await logAction(`Deleted Downloadable Document: ${title}`, "downloads", id);
        toast.success("Document deleted!");
      } catch (err) {
        toast.error("Failed to delete document");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-bold text-slate-800">Downloads Cabinet</h1>
        <p className="text-xs text-slate-500">Upload PDF syllabus details, rules flyers, and academic schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border border-slate-200 bg-white rounded-3xl shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Upload Document</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Document Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Club Rules Guide"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Option A: Select File (PDF, DOC)</label>
              <Input type="file" onChange={handleFileUpload} disabled={saving || !newTitle} className="text-xs" />
              {uploadProgress > 0 && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Option B: Document URL Link</label>
                <Input
                  value={pastedUrl}
                  onChange={(e) => setPastedUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  disabled={saving || !newTitle}
                />
              </div>
              <Button 
                onClick={handleAddLink} 
                disabled={saving || !newTitle || !pastedUrl} 
                className="w-full bg-slate-800 text-white rounded-xl py-2 text-xs font-bold uppercase tracking-wider"
              >
                Add Document Link
              </Button>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800">Active Downloads</h3>
          {loading ? (
            <Skeleton className="h-32 w-full bg-slate-200" />
          ) : downloads.length === 0 ? (
            <EmptyState title="No Downloads Registered" description="Upload document resources from the panel form." icon={<Download className="h-6 w-6 stroke-[1.5]" />} />
          ) : (
            <div className="space-y-3">
              {downloads.map((item) => (
                <div key={item.id} className="p-4 border border-slate-200 bg-white rounded-2xl flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      {item.fileType} • {item.fileSize || "Unknown size"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-bold">
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                    <Button onClick={() => handleDelete(item.id, item.title)} size="sm" variant="ghost" className="rounded-xl text-rose-500 font-semibold hover:bg-rose-50">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
