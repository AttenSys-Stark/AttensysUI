"use client";

import { RESET } from "jotai/utils";
import { useEffect } from "react";
import { useAtom } from "jotai";
/*import { connect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";

import {
  useAccount,
  useReadContract,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { attensysOrgAddress } from "./../deployments/contracts";
import { attensysOrgAbi } from "./../deployments/abi";
import { RpcProvider, Contract, Account, ec, json } from "starknet";
import Mockevent from "@/components/Mockevent";
import MockOrganization from "@/components/MockOrganization";
import Mockcourse from "@/components/Mockcourse";
import MockAboutus from "@/components/MockAboutus";
import Explore from "@/components/courses/Explore";
*/
import Landing from "@/components/homepage/Landing";
import { useWallet } from "@/hooks/useWallet";
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext";

export default function Home() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const { autoConnectWallet } = useWallet();

  useEffect(() => {
    if (wallet) return;
    autoConnectWallet();
  }, [wallet]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET);
      });
    }
  }, []);

  return (
    <div>
      {/* <MockAboutus /> */}
      <Landing />
      {/* <Explore /> */}
    </div>
  );
}
