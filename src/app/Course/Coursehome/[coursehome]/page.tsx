"use client";
import React, { useEffect } from "react";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseNews from "@/components/courses/CourseNews";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const section = params.coursehome;

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  return (
    <>
      <Header />
      <CourseNews />
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

          <CourseFormLanding section={section} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
