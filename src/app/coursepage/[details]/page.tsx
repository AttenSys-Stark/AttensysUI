"use client";
import React, { useState, useEffect } from "react";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useParams } from "next/navigation";
import CourseLanding from "@/components/courses/CourseLanding";
import CourseNews from "@/components/courses/CourseNews";
import { MoonLoader } from "react-spinners";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const details = params.details;

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  return (
    <ErrorBoundary>
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
        </div>

        <CourseLanding course={details} />
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default Index;
