import React, { useEffect } from "react";
import OverviewDiscover from "./OverviewDiscover";
import Tab from "./Tab";
import Content from "./Content";
import { attendancesuccess } from "@/state/connectedWalletStarknetkitNext";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAtom } from "jotai";

const OverviewLanding = (props: any) => {
  const [attendanceOverlayStat] = useAtom(attendancesuccess);

  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      {attendanceOverlayStat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" colorVariant="primary" />
            <p className="text-gray-700 font-medium">
              QR detected... Please wait
            </p>
          </div>
        </div>
      )}
      <OverviewDiscover eventsname={props.eventname} />
      <Tab eventname={props.eventname} />
      <Content eventname={props.eventname} tabsection={props.tab} />
    </div>
  );
};

export default OverviewLanding;
