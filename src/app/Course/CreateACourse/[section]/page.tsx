"use client";
import React, { useState, useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";
import CourseFormLanding from "@/components/courses/course-form/CourseFormLanding";
import { MoonLoader } from "react-spinners";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const section = params.section;

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 seconds fake delay or until data is fetched.

    return () => clearTimeout(timer); // cleanup
  }, []);

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
          // <Explore wallet={wallet} courseData={courseData} />
          <CourseFormLanding section={section} />
        )}
      </div>
    </div>
  );
};

export default Index;
