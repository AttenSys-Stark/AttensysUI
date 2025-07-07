import React, { useEffect, useState } from "react";
import Info from "./Info";
import Notifcation from "./Notifcation";
import MybootcampInfo from "./MybootcampInfo";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const MybootcampLanding = () => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [mybootcampDataInfo, setMyBootcampdataInfo] = useState<any[]>([]);
  const { account, address } = useFirebaseAuth();

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getMybootcampData = async () => {
    const my_bootcamps_info =
      await orgContract?.get_registered_bootcamp(address);
    console.log("my bootcamp data", my_bootcamps_info);

    const newBootcampData = await Promise.all(
      my_bootcamps_info.map(async (data: any) => {
        return await getBootcampInfo(data.address_of_org, data.bootcamp_id);
      }),
    );
    setMyBootcampdataInfo((prevData) => [...prevData, ...newBootcampData]);
  };

  const getBootcampInfo = async (org: any, id: any) => {
    const bootcampInfo = await orgContract?.get_bootcamp_info(org, id);
    console.info("my bootcamp fetch", bootcampInfo);
    return bootcampInfo;
  };

  useEffect(() => {
    getMybootcampData();
  }, [account, address]);

  return (
    <div className="h-auto w-full bg-[#F5F7FA] pb-8">
      <div className={`bg-[url('/mybootcampbg.png')] w-full h-[222px]`}></div>
      <Info wallet={wallet} />
      <Notifcation wallet={wallet} />
      <MybootcampInfo mybootcampinfo={mybootcampDataInfo} />
    </div>
  );
};

export default MybootcampLanding;
