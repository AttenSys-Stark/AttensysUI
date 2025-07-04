"use client";
import React, { useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { useParams } from "next/navigation";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import ExploreResult from "@/components/explorer/result/ExploreResult";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseNews from "@/components/courses/CourseNews";
const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const params = useParams();

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setStatus(false);
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
        </div>

        <ExploreResult params={params} />
      </div>
      <Footer />
    </>
  );
};

export default Index;
