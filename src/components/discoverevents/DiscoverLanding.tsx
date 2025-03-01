"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TopdiscoverSection from "./TopdiscoverSection";
import Backgroundsection from "./Backgroundsection";
import Timesection from "./Timesection";
import Highlight from "./Highlight";
import Allevents from "./Allevents";
import { Contract } from "starknet";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { decimalToHexAddress } from "@/utils/formatAddress";
import { useEvents } from "@/hooks/useEvents";

export interface EventData {
  event_name: string;
  event_organizer: any;
  registered_attendants: string;
  signature_count: number;
  time: {
    end_time: bigint;
    start_time: bigint;
    registeration_open: boolean;
  };
}
const DiscoverLanding = () => {
  const { events, getEvents } = useEvents();

  useEffect(() => {
    getEvents();
  }, [getEvents]);
  return (
    <div className=" w-full bg-event-gradient">
      <TopdiscoverSection />
      <Backgroundsection />
      <Timesection />
      <Highlight />
      <Allevents events={events} />
    </div>
  );
};

export default DiscoverLanding;
