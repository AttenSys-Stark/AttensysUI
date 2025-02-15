"use client";
import React, { useEffect } from "react";
import Eventslanding from "@/components/events/Eventslanding";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const section = params.section;

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  return (
    <div className="overflow-x-hidden" onClick={handlePageClick}>
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
      <Eventslanding section={section} />
    </div>
  );
};

export default Index;
