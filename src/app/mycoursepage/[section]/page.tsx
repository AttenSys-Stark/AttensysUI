"use client";
import React, { useState, useEffect } from "react";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
  courseInitState,
} from "@/state/connectedWalletStarknetkitNext";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useParams } from "next/navigation";
import MyCoursePage from "@/components/courses/mycourse/MyCoursePage";
import { MoonLoader } from "react-spinners";
import { FileObject } from "pinata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// file setup
const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
};
interface Lecture {
  name: string;
  description: string;
  video: File | null;
}

const ResetCourseRegistrationData = {
  primaryGoal: "",
  targetAudience: "",
  courseArea: "",
  courseIdentifier: "",
  courseName: "",
  courseCreator: "",
  courseDescription: "",
  courseCategory: "",
  difficultyLevel: "",
  studentRequirements: "",
  learningObjectives: "",
  targetAudienceDesc: "",
  courseImage: emptyData,
  courseCurriculum: [] as Lecture[],
  coursePricing: "",
  promoAndDiscount: "",
  publishWithCertificate: false,
  price: 0,
};

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const [courseData, setCourseData] = useAtom(courseInitState);

  const params = useParams();
  const section = params.section;
  const [loading, setLoading] = useState(true);

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  useEffect(() => {
    setCourseData(ResetCourseRegistrationData);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 1 seconds fake delay or until data is fetched.

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh", // Full page height
            }}
          >
            <MoonLoader color="#9B51E0" size={30} />
          </div>
        ) : (
          <MyCoursePage section={section} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Index;
