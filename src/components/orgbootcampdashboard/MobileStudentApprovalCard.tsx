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
import { useConnect } from "@starknet-react/core";
import { useAtom } from "jotai";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Contract } from "starknet";

interface MobileStudentApprovalCardProps {
  student: {
    student_details_uri: string;
    address_of_student: string;
    status: "pending" | "approved" | "declined";
  };
  arg: "both" | "check" | "cancel";
}

const MobileStudentApprovalCard = ({
  student,
  arg,
}: MobileStudentApprovalCardProps) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();
  const id = searchParams.get("id");
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setOrgname(n));
  // }, [address, controller]);

  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    account,
  );

  const getIpfsData = async () => {
    try {
      const data = await fetchCIDContent(student?.student_details_uri);
      //@ts-ignore
      setEmail(data?.data?.student_email);
      //@ts-ignore
      setName(data?.data?.student_name);
    } catch (error) {
      // Handle error silently
    }
  };

  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const approve_calldata = organizationContract.populate(
        "approve_registration",
        [student?.address_of_student, id || ""],
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

  const renderStatus = (status: string) => {
    if (status === "pending") {
      return (
        <>
          <h1 className="text-[#115E2C]">Pending</h1>
        </>
      );
    } else if (status === "approved") {
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
          {renderStatus(student?.status)}
        </div>
      </div>
      <h4 className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
        {name}
      </h4>
      <p className="text-[14px] leading-[17px] text-[#9B51E0] font-normal">
        11 Oct, 2024 | 10:25 PM
      </p>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 ${arg === "both" ? "right-5" : "right-16 md:right-5"} flex items-center  gap-[6px]`}
      >
        {renderButton(arg)}
      </div>
    </div>
  );
};

export default MobileStudentApprovalCard;
