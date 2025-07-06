"use client";
import correct from "@/assets/correct.png";
import ex from "@/assets/ex.svg";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import ControllerConnector from "@cartridge/connector/controller";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useAccount, useConnect } from "@starknet-react/core";
import { useAtom } from "jotai";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Contract } from "starknet";

const Pendinglist = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  const { connect, connectors } = useConnect();
  const controller = connectors[0] as ControllerConnector;

  useEffect(() => {
    if (!address) return;
    controller.username()?.then((n) => setOrgname(n));
  }, [address, controller]);

  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    account,
  );

  const getIpfsData = async () => {
    try {
      const data = await fetchCIDContent(props?.info?.student_details_uri);
      //@ts-ignore
      setEmail(data?.data?.student_email);
      //@ts-ignore
      setName(data?.data?.student_name);
    } catch (error) {
      // Handle error silently
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const approve_calldata = organizationContract.populate(
        "approve_registration",
        [props?.info?.address_of_student, id],
      );

      const callContract = await account?.execute([
        {
          contractAddress: attensysOrgAddress,
          entrypoint: "approve_registration",
          calldata: approve_calldata.calldata,
        },
      ]);
      if (!callContract) {
        throw new Error("Transaction not executed");
      }
      await account?.waitForTransaction(callContract?.transaction_hash);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      const approve_calldata = organizationContract.populate(
        "decline_registration",
        [props?.info?.address_of_student, id],
      );
      const callContract = await account?.execute([
        {
          contractAddress: attensysOrgAddress,
          entrypoint: "decline_registration",
          calldata: approve_calldata.calldata,
        },
      ]);
      if (!callContract) {
        throw new Error("Transaction not executed");
      }
      await account?.waitForTransaction(callContract?.transaction_hash);
    } catch (error) {
      console.error("Decline failed:", error);
    } finally {
      setIsDeclining(false);
    }
  };

  const renderButton = (arg: any) => {
    if (arg == "both") {
      return (
        <div className="flex space-x-3 items-center justify-center">
          <div className="relative">
            {isDeclining ? (
              <LoadingSpinner size="sm" colorVariant="primary" />
            ) : (
              <Image
                src={ex}
                alt="cancel"
                onClick={handleDecline}
                className={`cursor-pointer ${isDeclining ? "opacity-50" : ""}`}
              />
            )}
          </div>
          <div className="relative">
            {isApproving ? (
              <LoadingSpinner size="sm" colorVariant="primary" />
            ) : (
              <Image
                src={correct}
                alt="check"
                onClick={handleApprove}
                className={`cursor-pointer ${isApproving ? "opacity-50" : ""}`}
              />
            )}
          </div>
        </div>
      );
    } else if (arg == "check") {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={correct} alt="check" className=" cursor-not-allowed" />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center">
            <Image src={ex} alt="cancel" className=" cursor-not-allowed" />
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    getIpfsData();
  }, [account, address]);

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
