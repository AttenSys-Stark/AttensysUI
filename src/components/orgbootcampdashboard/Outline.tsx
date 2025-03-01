"use client";
import React, { useEffect, useState } from "react";
import OutlineCard from "./OutlineCard";
import { FaPlus } from "react-icons/fa6";
import {
  addclassmodal,
  currentID,
  orgowneraddress,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { pinata } from "../../../utils/config";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useSearchParams } from "next/navigation";

const orgContract = new Contract(attensysOrgAbi, attensysOrgAddress, provider);

const Outline = () => {
  const [dataStat, setDataStat] = useState(false);
  const [addClass, setAddclass] = useAtom(addclassmodal);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [bootcampid, setbootcampid] = useAtom(currentID);
  const [ownerAddress, setowneraddress] = useAtom(orgowneraddress);
  const [videoarray, setVideoArray] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");

  console.log("this is ID", id);
  console.log("this is org", org);
  // console.log("new new id",bootcampid )
  // console.log("ownerAddress",ownerAddress )
  const handleAddclass = () => {
    setAddclass({ modalstatus: true, idnumber: Number(id) });
  };

  const getUploadedVideo = async () => {
    let video_data = await orgContract.get_bootcamp_uploaded_video_link(
      org,
      id,
    );
    console.log("video data here", video_data);

    if (video_data?.length == 0) {
      setDataStat(true);
    } else {
      setVideoArray(video_data);
    }
  };

  useEffect(() => {
    getUploadedVideo();
  }, [wallet]);

  return (
    <div className="relative w-full md:w-[90%] h-[721px] bg-transparent md:bg-[#FFFFFF]  md:mx-auto md:rounded-xl md:border-[#D2D2D2] md:border-[1px] px-6 md:px-7 ">
      {dataStat && (
        <div className="h-[600px] w-full flex items-center justify-center">
          <h1>No Video upload</h1>
        </div>
      )}
      {!dataStat && (
        <div className="h-[600px] w-full overflow-y-scroll pt-10 px-10">
          {videoarray?.map((data, index) => {
            return <OutlineCard key={index} />;
          })}
        </div>
      )}
      <div
        className="hidden sticky bottom-0 w-[100%] bg-white md:flex items-center justify-center space-x-4 border-b-[1px] mt-2 h-[80px] cursor-pointer border-[1px] rounded-lg border-[#C2C2C2]"
        onClick={handleAddclass}
      >
        <FaPlus />
        <h1 className="font-medium text-[16px] leading-[22px] underline">
          Upload new class recording{" "}
        </h1>
      </div>
    </div>
  );
};

export default Outline;
