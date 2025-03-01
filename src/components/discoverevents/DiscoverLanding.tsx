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
  const [events, setEvents] = useState<EventData[]>([]);
  const eventContract = useMemo(
    () => new Contract(attensysEventAbi, attensysEventAddress, provider),
    [],
  );

  const getEvents = useCallback(async () => {
    try {
      const res = await eventContract.get_all_events();
      const formatedRes = res.map((data: any) => {
        return {
          event_name: data.event_name,
          event_organizer: decimalToHexAddress(data.event_organizer),
          registered_attendants: data.registered_attendants,
          signature_count: data.signature_count,
          time: {
            end_time: data.time.end_time,
            start_time: data.time.start_time,
            registeration_open: data.time.registeration_open,
          },
        };
      });
      console.log({ formatedRes });
      setEvents(formatedRes);
    } catch (error) {
      console.error("get_all_events error", error);
    }
  }, [eventContract]);

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
