"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
} from "@/state/connectedWalletStarknetkitNext";

import Coursedropdown from "@/components/courses/Coursedropdown";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";
import BootcampLanding from "@/components/bootcamp/BootcampLanding";

const Index = () => {
  const [courseDropdown, setCourseDropdown] = useAtom(coursestatusAtom);
  const [bootcampDropdown, setBootcampDropdown] = useAtom(
    bootcampdropdownstatus,
  );

  const handlePageClick = () => {
    setBootcampDropdown(false);
    setCourseDropdown(false);
  };
  return (
    <div onClick={handlePageClick}>
      {courseDropdown && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampDropdown && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>
      <BootcampLanding />
    </div>
  );
};

export default Index;
