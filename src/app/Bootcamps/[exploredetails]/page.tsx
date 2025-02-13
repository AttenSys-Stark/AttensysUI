"use client";
import React, { useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
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
import { useAtom, useSetAtom } from "jotai";
import BootcampLanding from "@/components/bootcamp/BootcampLanding";
import Explorebootcampdetails from "@/components/bootcamp/Explorebootcampdetails";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const params = useParams();
  const bootcamp = params.exploredetails;
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
      <Explorebootcampdetails />
    </div>
  );
};

export default Index;
