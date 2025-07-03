/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { MoonLoader } from "react-spinners";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import Coursedropdown from "@/components/courses/Coursedropdown";
import CourseNews from "@/components/courses/CourseNews";
import Explore from "@/components/courses/Explore";

import { provider } from "@/constants";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  bootcampdropdownstatus,
  coursestatusAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { getAllCoursesInfo } from "@/utils/helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Adminpanel from "@/components/console/Adminpanel";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
interface Uri {
  first: string;
  second: string;
}

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
  is_approved: boolean;
}

const Index = () => {
  const [wallet] = useAtom(walletStarknetkit);
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampDropStat, setBootcampDropStat] = useAtom(
    bootcampdropdownstatus,
  );

  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { fetchCIDContent } = useFetchCID();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set mounted
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch all course base data
  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        const res = await getAllCoursesInfo();
        if (isMounted) setAllCourses(res);
      } catch (err) {
        console.error("Error fetching course list", err);
      }
    };
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [provider]);

  useEffect(() => {
    // Use a local variable to track the mounted state
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;

      if (!user) {
        router.push("/");
      } else {
        // Check if user is admin
        if (user.email !== "attensyshq@gmail.com") {
          // User is not admin, redirect to Home
          router.push("/Home");
          return;
        }

        // User is admin
        setIsAdmin(true);
        setIsAuthenticated(true);
        setLoading(false);
      }
      // if (user) {
      //   console.log("user Data", user);
      // }
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

  // UI Events
  const handlePageClick = () => {
    setBootcampDropStat(false);
    setStatus(false);
  };

  const clearSearch = () => {
    router.push("/Course");
  };

  // Show loading spinner while checking admin status
  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div onClick={handlePageClick}>
        {(status || bootcampDropStat) && (
          <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
        )}

        <div onClick={(e) => e.stopPropagation()}>
          <Coursedropdown />
          <Bootcampdropdown />
        </div>
        <Adminpanel courseData={allCourses} />

        <Footer />
      </div>
    </>
  );
};

export default Index;
