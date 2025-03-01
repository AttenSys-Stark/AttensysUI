import { EventData } from "@/components/discoverevents/DiscoverLanding";
import { provider } from "@/constants";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { decimalToHexAddress } from "@/utils/formatAddress";
import { useCallback, useMemo, useState } from "react";
import { Contract } from "starknet";

export const useEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const eventContract = useMemo(
    () => new Contract(attensysEventAbi, attensysEventAddress, provider),
    [],
  );

  const getEvents = useCallback(async () => {
    try {
      setloading(true);
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
      setloading(false);
    } catch (error) {
      console.error("get_all_events error", error);
      setloading(false);
    }
  }, [eventContract]);

  return {
    events,
    getEvents,
    loading,
  };
};
