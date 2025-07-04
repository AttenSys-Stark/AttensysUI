"use client";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  bootcampdropdownstatus,
  coursestatusAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import MyCertifications from "@/components/certifications/MyCertifications";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { useRouter, useSearchParams } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { Account, Contract } from "starknet";
import { connect } from "starknetkit";
import { useAccount, useConnect } from "@starknet-react/core";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import CourseNews from "@/components/courses/CourseNews";

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
  const [certifiedCourses, setCertifiedCourses] = useState<CourseType[]>([]);
  const { fetchCIDContent } = useFetchCID();
  const userId = null;
  const search = searchParams.get("userId");
  const [account, setAccount] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const getCertifiedCourses = async () => {
    if (!address) {
      console.log("No address available");
      return;
    }

    try {
      console.log("Fetching certified courses for address:", address);
      const allCourses = await courseContract?.get_all_courses_info();
      console.log("All courses found:", allCourses?.length || 0, "courses");

      const certifiedCoursesList = await Promise.all(
        allCourses.map(async (course: CourseType) => {
          if (Number(course.course_identifier) != 0) {
            console.log(
              "Checking certification for course:",
              course.course_identifier,
            );
            const isCertified =
              await courseContract?.is_user_certified_for_course(
                address,
                course.course_identifier,
              );
            console.log(
              "Certification status for course",
              course.course_identifier,
              ":",
              isCertified,
            );

            if (isCertified) {
              return course;
            }
          }
          return null;
        }),
      );

      const validCourses = certifiedCoursesList.filter(
        (course): course is CourseType => course !== null,
      );
      console.log("Total certified courses found:", validCourses.length);
      setCertifiedCourses(validCourses);
    } catch (error) {
      console.error("Error in getCertifiedCourses:", error);
      setCertifiedCourses([]);
    }
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
    if (address) {
      getCertifiedCourses();
    }
  }, [address]);

  // Add console logs to track state changes
  useEffect(() => {
    console.log("Certified Courses updated:", certifiedCourses);
  }, [certifiedCourses]);

  useEffect(() => {
    const logStarknetCredentials = async () => {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          const profile = await getUserProfile(user.uid);
          const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
          if (profile) {
            const decryptedPrivateKey = decryptPrivateKey(
              profile.starknetPrivateKey,
              encryptionSecret,
            );
            console.log("starknetAddress:", profile.starknetAddress);
            console.log("starknetPrivateKey:", decryptedPrivateKey);
            const userAccount = new Account(
              provider,
              profile.starknetAddress,
              decryptedPrivateKey,
            );
            console.log("userAccount:", userAccount);
            setAccount(userAccount);
            setAddress(profile.starknetAddress);
            setUsername(profile.displayName);
          } else {
            console.log("No user profile found in Firestore.");
          }
        } else {
          console.log("No authenticated user found.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    logStarknetCredentials();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <CourseNews />
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
              height: "100vh",
            }}
          >
            <MoonLoader color="#9B51E0" size={60} />
          </div>
        ) : (
          <MyCertifications
            address={address}
            certifiedCourses={certifiedCourses}
            username={username}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Index;
