"use cli";
import { EventData } from "@/components/discoverevents/DiscoverLanding";
import { provider } from "@/constants";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { decimalToHexAddress } from "@/utils/formatAddress";
import { useCallback, useMemo, useState } from "react";
import { Contract } from "starknet";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";

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
          event_uri: data.event_uri,
          suspension_status: data.is_suspended,
        };
      });
      // console.log({ formatedRes });
      setEvents(formatedRes);
      setloading(false);
    } catch (error) {
      console.error("get_all_events error", error);
      throw error;
    } finally {
      setloading(false);
    }
  }, [eventContract]);

  const getEventsRegiseredUsers = useCallback(
    async (eventId: bigint) => {
      try {
        const res = await eventContract.get_registered_users(eventId);

        return res;
      } catch (error) {
        console.error("get_registered_users error", error);
        throw error;
      }
    },
    [eventContract],
  );

  return {
    events,
    getEvents,
    getEventsRegiseredUsers,
    loading,
  };
};

export const useCreatedEvents = () => {
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);

  const eventContract = useMemo(
    () => new Contract(attensysEventAbi, attensysEventAddress, provider),
    [],
  );

  const getCreatedEvents = useCallback(async () => {
    try {
      setloading(true);
      const res = await eventContract.get_all_created_events(
        wallet?.selectedAddress,
      );
      const formatedRes = res.map((data: any) => {
        return data;
      });
      // console.log({ formatedRes });
      setCreatedEvents(formatedRes);
      setloading(false);
    } catch (error) {
      console.error("get_all_created_event error", error);
      setloading(false);
    }
  }, [eventContract]);

  return {
    createdEvents,
    getCreatedEvents,
    loading,
  };
};
