"use client";
import React, { useState, useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import MyCertifications from "@/components/certifications/MyCertifications";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MoonLoader } from "react-spinners";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { Contract } from "starknet";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { connect } from "starknetkit";
import { pinata } from "../../../../utils/config";

interface CourseType {
  data: any;
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
}

interface Uri {
  first: string;
  second: string;
}
const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [takenCourses, setTakenCourses] = useState<CourseType[]>([]);
  const [takenCoursesData, setTakenCoursesData] = useState<CourseType[]>([]);

  const userId = null;
  // const userId = searchParams.get('userId');
  const search = searchParams.get("userId");

  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };
  const getPubIpfs = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);
      return data;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
    }
  };

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    wallet?.account,
  );

  const getAllUserCreatedCourses = async () => {
    if (wallet == undefined) return;
    const res: CourseType[] = await courseContract?.get_all_creator_courses(
      wallet?.selectedAddress,
    );

    const secondRes: CourseType[] = await courseContract?.get_all_taken_courses(
      wallet?.selectedAddress,
    );

    setCourses(res);
    setTakenCourses(secondRes);
  };

  const getSingleCourse = async () => {
    if (!courses.length) return; // Prevent running on empty `courses`
    if (!takenCourses.length) return; // Prevent running on empty `courses`

    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          return null; // Skip invalid URLs
        }

        try {
          return await getPubIpfs(course.course_ipfs_uri);
        } catch (error) {
          console.error("Error fetching from IPFS:", error);
          return null; // Skip on failure
        }
      }),
    );
    const resolvedTakenCourses = await Promise.all(
      takenCourses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          return null; // Skip invalid URLs
        }

        try {
          return await getPubIpfs(course.course_ipfs_uri);
        } catch (error) {
          console.error("Error fetching from IPFS:", error);
          return null; // Skip on failure
        }
      }),
    );

    // Filter out null values before updating state
    const validCourses = resolvedCourses.filter(
      (course): course is any => course !== null,
    );
    // Filter out null values before updating state
    const validTakenCourses = resolvedTakenCourses.filter(
      (course): course is any => course !== null,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });

    // Remove duplicates before updating state
    setTakenCoursesData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validTakenCourses.filter(
          (newCourse) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });
  };

  // Fetch user-specific data when userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000); // 1 seconds fake delay or until data is fetched.
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet, connector } = await connect({
          //@ts-ignore
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Attensys",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        });

        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
      }
    };
    if (!wallet) {
      autoConnect();
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet) {
      getAllUserCreatedCourses();
    }
  }, [wallet]);

  useEffect(() => {
    if (courses.length || takenCourses.length) {
      getSingleCourse();
    }
  }, [courses, takenCourses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fa]" onClick={handlePageClick}>
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampdropstat && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full page height
          }}
        >
          <MoonLoader color="#9B51E0" size={60} />
        </div>
      ) : (
        <MyCertifications
          wallet={wallet}
          courseData={courseData}
          takenCoursesData={takenCoursesData}
        />
      )}
    </div>
  );
};

export default Index;
