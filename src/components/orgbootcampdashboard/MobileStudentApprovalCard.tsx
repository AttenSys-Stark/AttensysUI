"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ex from "@/assets/ex.svg";
import correct from "@/assets/correct.png";
import { pinata } from "../../../utils/config";
import { useSearchParams } from "next/navigation";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { Contract } from "starknet";
import { useWallet } from "@/hooks/useWallet";
import { provider } from "@/constants";

const MobileStudentApprovalCard = (props: any) => {
  const { wallet, session, sessionAccount, sessionKeyMode } = useWallet();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
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
    setLoading(true);

    try {
      if (!props?.info?.address_of_student || !id) {
        throw new Error("Missing student address or ID.");
      }

      // Populate calldata
      const approveCalldata = organizationContract.populate(
        "approve_registration",
        [props.info.address_of_student, id],
      );

      let result: { transaction_hash: string };

      // Use session account if present
      if (sessionKeyMode && session && sessionAccount) {
        result = await sessionAccount.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "approve_registration",
            calldata: approveCalldata.calldata,
          },
        ]);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        result = await wallet.account.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "approve_registration",
            calldata: approveCalldata.calldata,
          },
        ]);
      }

      // Wait for transaction confirmation
      await provider.waitForTransaction(result.transaction_hash);

      console.info("Student registration approved successfully.");
    } catch (e) {
      console.error("Error in handleApprove:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <div className="flex items-center justify-center space-x-3">
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
