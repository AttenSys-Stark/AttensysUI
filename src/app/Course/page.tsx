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

  const { fetchCIDContent } = useFetchCID();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();

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

  // Resolve IPFS data for each course
  useEffect(() => {
    if (allCourses.length === 0) return;
    let isMounted = true;

    const fetchCourseDetails = async () => {
      const resolved = await Promise.all(
        allCourses.map(async (course) => {
          if (!course.course_ipfs_uri) return null;
          console.log("Fetching course details:", course);
          try {
            if (course.is_approved) {
              const detailed = await fetchCIDContent(course.course_ipfs_uri);
              if (detailed) {
                return {
                  ...detailed,
                  course_identifier: course.course_identifier,
                  owner: course.owner,
                  course_ipfs_uri: course.course_ipfs_uri,
                  is_suspended: course.is_suspended,
                };
              }
              return detailed;
            }
          } catch {
            return null;
          }
        }),
      );

      const filtered = resolved.filter(Boolean) as CourseType[];

      if (isMounted) {
        setCourseData(filtered);
        setLoading(false);
      }
    };

    fetchCourseDetails();

    return () => {
      isMounted = false;
    };
  }, [allCourses]);

  // Filtered courses based on search
  const filteredCourseData = useMemo(() => {
    if (!searchQuery) return courseData;
    return courseData.filter((course) => {
      const data = course.data;
      if (!data) return false;

      const name = data.courseName?.toLowerCase() || "";
      const desc = data.courseDescription?.toLowerCase() || "";
      const author = data.authorName?.toLowerCase() || "";
      const categories = (data.categories || []).map((c: string) =>
        c.toLowerCase(),
      );

      return (
        name.includes(searchQuery) ||
        desc.includes(searchQuery) ||
        author.includes(searchQuery) ||
        categories.some((cat: string | string[]) => cat.includes(searchQuery))
      );
    });
  }, [searchQuery, courseData]);

  // UI Events
  const handlePageClick = () => {
    setBootcampDropStat(false);
    setStatus(false);
  };

  const clearSearch = () => {
    router.push("/Course");
  };

  // if (!mounted) return null;

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

        <CourseNews />

        {loading ? (
          <div className="flex items-center justify-center h-[90vh]">
            <MoonLoader color="#9B51E0" size={30} />
          </div>
        ) : mounted ? (
          <>
            {searchQuery && (
              <div className="container mx-auto px-4 py-2 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-800">
                    Search Results for:{" "}
                    <span className="text-purple-600">"{searchQuery}"</span>
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredCourseData.length === 0
                      ? "No courses found matching your search"
                      : `Found ${filteredCourseData.length} course${filteredCourseData.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            )}

            <Explore
              wallet={wallet}
              courseData={filteredCourseData}
              querystat={searchQuery}
              unfilteredData={courseData}
            />
            <Footer />
          </>
        ) : null}
      </div>
    </>
  );
};

export default Index;
