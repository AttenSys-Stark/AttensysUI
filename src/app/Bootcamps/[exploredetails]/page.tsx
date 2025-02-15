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
// import BootcampLanding from "@/components/bootcamp/BootcampLanding";
import { useAtom } from "jotai";
import Explorebootcampdetails from "@/components/bootcamp/Explorebootcampdetails";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const bootcamp = params.exploredetails;

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };
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
      <Explorebootcampdetails />
    </div>
  );
};

export default Index;
