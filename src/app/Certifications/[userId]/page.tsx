"use client";
import React, { useState, useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useAtom, useSetAtom } from "jotai";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest";
import { RESET } from "jotai/utils";
import { connect, disconnect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";

import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import MyCertifications from "@/components/certifications/MyCertifications";
import { useRouter, useSearchParams } from "next/navigation";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom);
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom);
  const setConnectorData = useSetAtom(connectorDataAtom);
  const setConnector = useSetAtom(connectorAtom);

  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

  useEffect(() => {
    /* setWalletLatest(RESET) */
    setWalletNext(RESET);
    setConnectorData(RESET);
    setConnector(RESET);
  }, []);

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet } = await connect({
          //@ts-ignore
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Attensys",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        });
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        alert((e as any).message);
      }
    };

    if (!wallet) {
      autoConnect();
    }
  }, [wallet]);

  let userId = null;
  // const userId = searchParams.get('userId');
  const search = searchParams.get("userId");

  // This will be logged on the server during the initial render
  // and on the client on subsequent navigations.
  console.log(search);

  // Now you can use the userId
  console.log(searchParams);
  // console.log(router)

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  // Simulate fetching user data from a database
  const user = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2021-01-01",
  };

  // Fetch user-specific data when userId changes
  useEffect(() => {
    if (userId) {
      // Simulating an API call to fetch user-specific data
      const fetchUserData = async () => {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      };

      fetchUserData();
    }
  }, [userId]);

  if (userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#f5f7fa]" onClick={handlePageClick}>
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

      <MyCertifications />
    </div>
  );
};

export default Index;
