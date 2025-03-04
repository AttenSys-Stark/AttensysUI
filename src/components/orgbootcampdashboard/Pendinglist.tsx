"use client";
import React, { useEffect, useState } from "react";
import ex from "@/assets/ex.svg";
import correct from "@/assets/correct.png";
import Image from "next/image";
import { pinata } from "../../../utils/config";
import { useSearchParams } from "next/navigation";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { Contract } from "starknet";
import { useWallet } from "@/hooks/useWallet";
import { provider } from "@/constants";

const Pendinglist = (props: any) => {
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
    setLoading(true); // Set loading state

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

  const handleDecline = async () => {
    setLoading(true); // Set loading state

    try {
      if (!props?.info?.address_of_student || !id) {
        throw new Error("Missing student address or ID.");
      }

      // Populate calldata
      const declineCalldata = organizationContract.populate(
        "decline_registration",
        [props.info.address_of_student, id],
      );

      let result: { transaction_hash: string };

      // Use session account if present
      if (sessionKeyMode && session && sessionAccount) {
        result = await sessionAccount.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "decline_registration",
            calldata: declineCalldata.calldata,
          },
        ]);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        result = await wallet.account.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "decline_registration",
            calldata: declineCalldata.calldata,
          },
        ]);
      }

      // Wait for transaction confirmation
      await provider.waitForTransaction(result.transaction_hash);

      console.info("Student registration declined successfully.");
    } catch (e) {
      console.error("Error in handleDecline:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (arg: any) => {
    if (arg == "both") {
      return (
        <>
          <div className="flex items-center justify-center space-x-3">
            <Image
              src={ex}
              alt="cancel"
              onClick={handleDecline}
              className="cursor-pointer "
            />
            <Image
              src={correct}
              alt="check"
              onClick={handleApprove}
              className="cursor-pointer "
            />
          </div>
        </>
      );
    } else if (arg == "check") {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={correct} alt="check" className="cursor-not-allowed " />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={ex} alt="cancel" className="cursor-not-allowed " />
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
    <tbody>
      <tr>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          {email}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          {name}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px]">
          {renderStatus(props.arg)}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#9B51E0]">
          11 Oct, 2024 | 10:25 PM
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-[#9B51E0]">
          {renderButton(props.arg)}
        </td>
      </tr>
    </tbody>
  );
};

export default Pendinglist;
