"use client";
import React, { useEffect, useState } from "react";
import Landing from "@/components/homepage/Landing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import {
  loginorsignup,
  accountloadstate,
} from "@/state/connectedWalletStarknetkitNext";
import CourseNews from "@/components/courses/CourseNews";

const HomePage = () => {
  const router = useRouter();
  const { user, loading, isGuest } = useAuth();
  const [loginorsignupstat, setLoginorsignupstat] = useAtom(loginorsignup);
  const [, setAccountloadProgress] = useAtom(accountloadstate);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push("/");
    } else if (user) {
      setLoginorsignupstat(false);
      // Only reset the account loading progress when user is authenticated AND page has loaded
      if (user && !loading) {
        setAccountloadProgress(false);
      }
    }
  }, [
    user,
    loading,
    isGuest,
    router,
    setLoginorsignupstat,
    setAccountloadProgress,
  ]);

  // Mark page as loaded after initial render
  useEffect(() => {
    if (!loading && (user || isGuest)) {
      setPageLoaded(true);
    }
  }, [loading, user, isGuest]);

  // Reset loading state only after page is fully loaded and user is authenticated
  useEffect(() => {
    if (pageLoaded && user && !loading) {
      setAccountloadProgress(false);
    }
  }, [pageLoaded, user, loading, setAccountloadProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return null; // or a redirect message
  }

  return (
    <div className="animate-fade-in">
      <Header />
      <CourseNews />
      <Landing />
      <Footer />
    </div>
  );
};

export default HomePage;
