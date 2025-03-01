"use client";
import React, { useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";
import ExplorePage from "@/components/explorer/ExplorePage";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";

const Index = () => {
  const [status, setStatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setStatus(false);
  };

  return (
    <div onClick={handlePageClick}>
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm "></div>
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

      <ExplorePage />
    </div>
  );
};

export default Index;
