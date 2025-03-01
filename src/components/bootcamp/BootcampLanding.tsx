import React, { useEffect, useState } from "react";
import BootcampHero from "./BootcampHero";
import BootcampCarousell from "./BootcampCarousell";
import Organizations from "./Organizations";
import { FavoriteCourse } from "./FavoriteCourse";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { pinata } from "../../../utils/config";

const BootcampLanding = () => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [bootcampDataInfo, setBootcampdataInfo] = useState([]);
  const [allorgInfo, setAllorgInfo] = useState([]);

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getAllBootcamps = async () => {
    const bootcamps_info = await orgContract?.get_all_bootcamps_on_platform();
    setBootcampdataInfo(bootcamps_info);
  };

  const getAllOrgInfo = async () => {
    const AllOrg_info = await orgContract?.get_all_org_info();
    console.info("intiial fetch", AllOrg_info);
    setAllorgInfo(AllOrg_info);
  };

  useEffect(() => {
    getAllBootcamps();
    getAllOrgInfo();
  }, [wallet]);
  return (
    <div className="h-auto w-full bg-[#f5f8fa]">
      <BootcampHero />
      <BootcampCarousell allbootcampInfo={bootcampDataInfo} />
      <Organizations allorginfo={allorgInfo} />
      <FavoriteCourse />
    </div>
  );
};

export default BootcampLanding;
