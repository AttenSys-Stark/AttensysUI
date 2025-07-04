"use client";
import React, { useEffect, useState } from "react";
import Landing from "@/components/homepage/Landing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import CourseNews from "@/components/courses/CourseNews";
const HomePage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [loginorsignupstat, setLoginorsignupstat] = useAtom(loginorsignup);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      setLoginorsignupstat(false);
    }
  }, [user, loading, router, setLoginorsignupstat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
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
