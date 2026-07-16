"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { AdminUser } from "@/types";

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "adminUsers", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setAdminProfile(snap.data() as AdminUser);
          } else {
            // Fallback default admin profile if document does not exist yet
            setAdminProfile({
              uid: currentUser.uid,
              email: currentUser.email || "",
              role: "superadmin",
              displayName: currentUser.displayName || "Administrator",
              createdAt: new Date(),
            });
          }
        } catch (err) {
          console.error("Error loading custom admin user document:", err);
          // Fallback profile on error
          setAdminProfile({
            uid: currentUser.uid,
            email: currentUser.email || "",
            role: "superadmin",
            displayName: currentUser.displayName || "Administrator",
            createdAt: new Date(),
          });
        }
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
