"use client";
import React, { useEffect, useState } from "react";
import LecturePage from "./LecturePage";
import { useSearchParams } from "next/navigation";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { connect } from "starknetkit";
import { getCourseDataById } from "@/utils/helpers";
import { useFetchCID } from "@/hooks/useFetchCID";

const CourseLanding = (props: any) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { fetchCIDContent } = useFetchCID();

  // Safe localStorage access with error handling and blockchain fallback
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create course-specific localStorage key
        const courseDataKey = courseId ? `courseData_${courseId}` : null;

        // First, try to get data from localStorage
        const storedData = courseDataKey
          ? localStorage.getItem(courseDataKey)
          : null;
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Validate that the parsed data has the expected structure
          if (parsedData && typeof parsedData === "object") {
            console.log("Course data loaded from localStorage");
            setCourseData(parsedData);
            setIsLoading(false);
            return;
          } else {
            console.warn("Invalid course data structure in localStorage");
          }
        }

        // If no localStorage data or invalid data, try to fetch from blockchain
        if (courseId) {
          console.log(
            "Fetching course data from blockchain for course ID:",
            courseId,
          );
          const fetchedCourseData = await getCourseDataById(
            courseId,
            fetchCIDContent,
          );

          if (fetchedCourseData) {
            console.log("Course data successfully fetched from blockchain");

            // Store the fetched data in localStorage with course-specific key
            // This ensures each course has its own cached data
            if (courseDataKey) {
              localStorage.setItem(
                courseDataKey,
                JSON.stringify(fetchedCourseData),
              );
            }
            setCourseData(fetchedCourseData);
          } else {
            setError("Course not found or unavailable");
          }
        } else {
          setError("Course ID not provided");
        }
      } catch (err) {
        console.error("Error loading course data:", err);
        setError("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, fetchCIDContent]);

  // Add debugging for courseData structure
  useEffect(() => {
    if (courseData) {
      console.log("CourseLanding - Course data loaded successfully");
      console.log(
        "CourseLanding - courseCurriculum length:",
        courseData.courseCurriculum?.length || 0,
      );
    }
  }, [courseData]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="h-auto w-full bg-[#F5F7FA] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B51E0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="h-auto w-full bg-[#F5F7FA] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2D3A4B] mb-4">
            Course Not Available
          </h2>
          <p className="text-[#2D3A4B] mb-6">
            {error}. Please try accessing the course from the main page.
          </p>
          <button
            onClick={() => (window.location.href = "/Home")}
            className="bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold hover:bg-[#8a4ad0] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <LecturePage course={props.course} data={{ ...courseData, course_identifier: props.course?.course_identifier }} wallet={wallet} />
    </div>
  );
};

export default CourseLanding;
