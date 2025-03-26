"use client";
import React, { useEffect, useState } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { getAllCoursesInfo } from "@/utils/helpers";
import { pinata } from "../../../utils/config";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import Explore from "@/components/courses/Explore";
import CourseNews from "@/components/courses/CourseNews";
import { GetCIDResponse } from "pinata";
import { provider } from "@/constants";
import { MoonLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(true);
  const [wallet] = useAtom(walletStarknetkit);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseData, setCourseData] = useState<CourseType[]>([]);

  const getAllCourses = async () => {
    const res: CourseType[] = await getAllCoursesInfo();
    setCourses(res);
  };

  const getPubIpfs = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);

      // const courseImage: GetCIDResponse = await pinata.gateways.get(
      //   //@ts-ignore
      //   data?.data?.courseImage,
      // );

      return data;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
    }
  };

  const getCourse = async () => {
    // if (courses.length < 1) return; // Prevent running on empty `courses`
    // console.log("This guy", courses);

    const resolvedCourses = await Promise.all(
      courses.map(async (course: CourseType) => {
        if (!course.course_ipfs_uri) {
          console.warn(`Skipping invalid IPFS URL: ${course.course_ipfs_uri}`);
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
      (course: any): course is any => course !== null,
    );

    // Remove duplicates before updating state
    setCourseData((prevCourses) => {
      const uniqueCourses = [
        ...prevCourses,
        ...validCourses.filter(
          (newCourse: any) =>
            !prevCourses.some(
              (prev) => prev.data.courseName === newCourse.data.courseName,
            ),
        ),
      ];
      return uniqueCourses;
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 1 seconds fake delay or until data is fetched.

    return () => clearTimeout(timer);
  };

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  useEffect(() => {
    getAllCourses();
  }, [provider]);

  useEffect(() => {
    getCourse();
  }, [courses]);

  return (
    <div onClick={handlePageClick}>
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

      <CourseNews />

      {loading ? (
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
        <Explore wallet={wallet} courseData={courseData} />
      )}
    </div>
  );
};

export default Index;
