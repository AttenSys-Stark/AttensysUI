"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ex from "@/assets/ex.svg";
import correct from "@/assets/correct.png";
import { pinata } from "../../../utils/config";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useSearchParams } from "next/navigation";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { Contract } from "starknet";

const MobileStudentApprovalCard = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    wallet?.account,
  );

  const getIpfsData = async () => {
    try {
      const data = await pinata.gateways.get(props?.info?.student_details_uri);
      console.log("student data", data);
      //@ts-ignore
      setEmail(data?.data?.student_email);
      //@ts-ignore
      setName(data?.data?.student_name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async () => {
    const approve_calldata = organizationContract.populate(
      "approve_registration",
      [props?.info?.address_of_student, id],
    );
    const callContract = await wallet?.account.execute([
      {
        contractAddress: attensysOrgAddress,
        entrypoint: "approve_registration",
        calldata: approve_calldata.calldata,
      },
    ]);
    //@ts-ignore
    wallet?.account?.provider
      .waitForTransaction(callContract.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.error("Error: ", e);
      })
      .finally(() => {
        //@todo set loading state here
      });
  };

  const renderButton = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <div className="flex space-x-3 items-center justify-center">
            <Image src={ex} alt="cancel" />
            <Image src={correct} alt="check" onClick={handleApprove} />
          </div>
        </>
      );
    } else if (arg == "check") {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={correct} alt="check" />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={ex} alt="cancel" />
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    getIpfsData();
  }, [wallet]);

  const renderStatus = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <h1 className="text-[#115E2C]">Pending</h1>
        </>
      );
    } else if (arg == "check") {
      return (
        <>
          <h1 className="text-[#115E2C]">Approved</h1>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-[#DC1D16]">Declined</h1>
        </>
      );
    }
  };

  return (
    <div className="w-full bg-white border border-[#DADADA] rounded-[15px] py-7 px-5 space-y-3 relative">
      <div className="flex items-center justify-between ">
        <p> {email}</p>
        <div className="bg-[#C5D3228C] rounded-[5px] px-[10px] py-[5px] text-[#115E2C] font-normal text-xs">
          {renderStatus(props.arg)}
        </div>
      </div>
      <h4 className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
        {name}
      </h4>
      <p className="text-[14px] leading-[17px] text-[#9B51E0] font-normal">
        11 Oct, 2024 | 10:25 PM
      </p>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 ${props.arg == "both" ? "right-5" : "right-16 md:right-5"} flex items-center  gap-[6px]`}
      >
        {renderButton(props.arg)}
      </div>
    </div>
  );
};

export default MobileStudentApprovalCard;
