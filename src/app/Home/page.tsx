"use client";
import React, { useEffect, useState } from "react";
import Landing from "@/components/homepage/Landing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginorsignupstat, setLoginorsignupstat] = useAtom(loginorsignup);

  useEffect(() => {
    // Use a local variable to track the mounted state
    let isMounted = true;

    if (!auth) {
      console.warn("Firebase auth is not available");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;

      if (!user) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
        setLoading(false);
        setLoginorsignupstat(false);
      }
      if (user) {
        console.log("user Data", user);
      }
    });

    // Add a timeout to ensure we don't show loader indefinitely
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
      }
    }, 2000); // 2 seconds timeout

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // or a redirect message
  }

  return (
    <div className="animate-fade-in">
      <Header />
      <Landing />
      <Footer />
    </div>
  );
};

export default HomePage;
