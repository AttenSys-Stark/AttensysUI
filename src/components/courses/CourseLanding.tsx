"use client";
import React, { useEffect, useState } from "react";
import LecturePage from "./LecturePage";
import { useSearchParams } from "next/navigation";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { connect } from "starknetkit";

const CourseLanding = (props: any) => {
  const storedData = localStorage.getItem("courseData");
  const [isConnecting, setIsConnecting] = useState(false);
  const courseData = storedData ? JSON.parse(storedData) : null;
  const [wallet, setWallet] = useAtom(walletStarknetkit);

  useEffect(() => {
    const autoConnect = async () => {
      if (!wallet) {
        setIsConnecting(true);
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
        } finally {
          setIsConnecting(false);
        }
      }
    };

    autoConnect();
  }, [wallet]);
  return (
    <div className="h-auto w-full bg-[#F5F7FA]">
      <LecturePage course={props.course} data={courseData} wallet={wallet} />
    </div>
  );
};

export default CourseLanding;
