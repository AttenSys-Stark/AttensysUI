import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useAtom } from "jotai";
import { isGuestMode } from "@/state/connectedWalletStarknetkitNext";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
}>({
  user: null,
  loading: true,
  isGuest: false,
  setIsGuest: () => {},
});

// Helper functions for guest mode cookies
const setGuestModeCookie = (isGuest: boolean) => {
  if (typeof window !== "undefined") {
    if (isGuest) {
      document.cookie = "guest-mode=true; path=/; max-age=86400"; // 24 hours
    } else {
      document.cookie =
        "guest-mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
};

const getGuestModeCookie = (): boolean => {
  if (typeof window === "undefined") return false;
  return document.cookie.includes("guest-mode=true");
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useAtom(isGuestMode);

  // Initialize guest mode from cookie on mount
  useEffect(() => {
    const guestFromCookie = getGuestModeCookie();
    if (guestFromCookie) {
      setIsGuest(true);
    }
  }, [setIsGuest]);

  // Update cookie when guest state changes
  useEffect(() => {
    setGuestModeCookie(isGuest);
  }, [isGuest]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // If user signs in, clear guest mode
      if (firebaseUser) {
        setIsGuest(false);
      }
    });
    return () => unsubscribe();
  }, [setIsGuest]);

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, setIsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
