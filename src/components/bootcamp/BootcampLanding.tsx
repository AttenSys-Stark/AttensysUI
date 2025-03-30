import React, { useEffect, useState, useMemo } from "react";
import BootcampHero from "./BootcampHero";
import BootcampCarousell from "./BootcampCarousell";
import Organizations from "./Organizations";
import { FavoriteCourse } from "./FavoriteCourse";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { Contract } from "starknet";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const BootcampLanding = () => {
  const [wallet] = useAtom(walletStarknetkit);
  const [bootcampDataInfo, setBootcampdataInfo] = useState<any[]>([]);
  const [allorgInfo, setAllorgInfo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  // BigInt serialization helper
  const serializeBigInt = (data: any): any => {
    if (data === null || data === undefined) return data;
    if (typeof data === "bigint") return data.toString();
    if (Array.isArray(data)) return data.map(serializeBigInt);
    if (typeof data === "object") {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          serializeBigInt(value),
        ]),
      );
    }
    return data;
  };

  const getAllBootcamps = async () => {
    const bootcamps_info = await orgContract?.get_all_bootcamps_on_platform();
    setBootcampdataInfo(serializeBigInt(bootcamps_info));
  };

  const getAllOrgInfo = async () => {
    const AllOrg_info = await orgContract?.get_all_org_info();
    setAllorgInfo(serializeBigInt(AllOrg_info));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getAllBootcamps(), getAllOrgInfo()]);
      } catch (error) {
        console.error("Error loading bootcamp data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Removed wallet dependency

  // Stable reference for org info
  const stableAllorgInfo = useMemo(
    () => allorgInfo,
    [JSON.stringify(allorgInfo)],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f8fa] flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <div className="h-auto w-full bg-[#f5f8fa]">
      <BootcampHero />
      <BootcampCarousell allbootcampInfo={bootcampDataInfo} />
      <Organizations allorginfo={stableAllorgInfo} />
      <FavoriteCourse />
    </div>
  );
};

export default BootcampLanding;
