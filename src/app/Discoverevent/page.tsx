"use client";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import Coursedropdown from "@/components/courses/Coursedropdown";
import DiscoverLanding from "@/components/discoverevents/DiscoverLanding";
import {
  bootcampdropdownstatus,
  coursestatusAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

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
      <DiscoverLanding />
    </div>
  );
};

export default Index;
