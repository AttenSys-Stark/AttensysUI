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
import MyCoursePage from "@/components/courses/mycourse/MyCoursePage";
import { MoonLoader } from "react-spinners";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const section = params.section;
  const [loading, setLoading] = useState(true);

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 seconds fake delay or until data is fetched.

    return () => clearTimeout(timer);
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
      </div>

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
        <MyCoursePage section={section} />
      )}
    </div>
  );
};

export default Index;
