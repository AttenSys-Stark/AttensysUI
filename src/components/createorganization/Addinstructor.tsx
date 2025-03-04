"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";

import Emailinput from "../overview/Emailinput";
import Addressinput from "./Addressinput";
import GaslessNotification from "../GaslessNotification";
import { useAvnuGasless } from "@/hooks/useAvnu";

import {
  organzationInitState,
  specificOrgRoute,
} from "@/state/connectedWalletStarknetkitNext";

import { pinata } from "../../../utils/config";
import { attensysOrgAddress } from "../../deployments/contracts";
import { attensysOrgAbi } from "../../deployments/abi";

import { Contract } from "starknet";
import type { FileObject } from "pinata";

const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => new ArrayBuffer(0),
};

const ResetOrgRegData = {
  organizationBanner: emptyData,
  organizationName: "",
  organizationDescription: "",
  organizationLogo: emptyData,
  organizationCategory: "",
  organizationAdminfullname: "",
  organizationAminEmail: "",
  organizationAdminWallet: "",
  organizationInstructorEmails: [""],
  organizationInstructorsWalletAddresses: [""],
};

interface AddInstructorProps {
  connectorDataAccount: any;
}

const AddInstructor: React.FC<AddInstructorProps> = ({
  connectorDataAccount,
}) => {
  const [emailList, setEmailList] = useState<string[]>([]);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [specificOrg, setSpecificOrg] = useAtom(specificOrgRoute);
  const [uploading, setUploading] = useState(false);
  const [showGaslessNotification, setShowGaslessNotification] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const {
    isPaymasterAvailable,
    compatibility,
    executeGaslessCalls,
    loading: gaslessLoading,
    error: gaslessError,
  } = useAvnuGasless(connectorDataAccount);

  const router = useRouter();

  useEffect(() => {
    console.log("Paymaster Available:", isPaymasterAvailable);
    console.log("Compatibility:", compatibility);
  }, [isPaymasterAvailable, compatibility]);

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails);
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationInstructorEmails: emails,
    }));
  };

  const handleAddressChange = (addresses: string[]) => {
    setAddressList(addresses);
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationInstructorsWalletAddresses: addresses,
    }));
  };

  const executeStandardTransaction = async (calls: any[]) => {
    try {
      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        connectorDataAccount,
      );

      const multiCall = await connectorDataAccount.execute(calls);

      const transactionHash =
        "transaction_hash" in multiCall
          ? multiCall.transaction_hash
          : multiCall.transactionHash;

      if (!transactionHash) {
        throw new Error("No transaction hash returned");
      }

      await connectorDataAccount?.provider.waitForTransaction(transactionHash);

      return transactionHash;
    } catch (error) {
      console.error("Standard transaction failed:", error);
      throw error;
    }
  };

  const handleMulticallRouting = async () => {
    setTransactionError(null);
    setUploading(true);

    try {
      const orgBannerUpload = await pinata.upload.file(
        organizationData.organizationBanner,
      );
      const orgLogoUpload = await pinata.upload.file(
        organizationData.organizationLogo,
      );

      const dataUpload = await pinata.upload.json({
        OrganizationName: organizationData.organizationName,
        OrganizationDescription: organizationData.organizationDescription,
        OrganizationBannerCID: orgBannerUpload.IpfsHash,
        OrganizationLogoCID: orgLogoUpload.IpfsHash,
        OrganizationCategory: organizationData.organizationCategory,
        OrganizationAdminName: organizationData.organizationAdminfullname,
        OrganizationAdminEmail: organizationData.organizationAminEmail,
        OrganizationAminWalletAddress: organizationData.organizationAdminWallet,
        OrganizationInstructorEmails:
          organizationData.organizationInstructorEmails,
        OrganizationInstructorWalletAddresses:
          organizationData.organizationInstructorsWalletAddresses,
      });

      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        connectorDataAccount,
      );

      const createOrgCalldata = organizationContract.populate(
        "create_org_profile",
        [organizationData.organizationName, dataUpload.IpfsHash],
      );

      const addInstructorCalldata = organizationContract.populate(
        "add_instructor_to_org",
        [
          organizationData.organizationInstructorsWalletAddresses,
          organizationData.organizationName,
        ],
      );

      const calls = [
        {
          contractAddress: attensysOrgAddress,
          entrypoint: "create_org_profile",
          calldata: createOrgCalldata.calldata,
        },
        {
          contractAddress: attensysOrgAddress,
          entrypoint: "add_instructor_to_org",
          calldata: addInstructorCalldata.calldata,
        },
      ];

      let transactionHash;

      if (isPaymasterAvailable && compatibility?.isCompatible) {
        const response = await executeGaslessCalls(calls);
        transactionHash = response.transactionHash;
      } else {
        transactionHash = await executeStandardTransaction(calls);
      }

      if (!transactionHash) {
        throw new Error("No transaction hash returned");
      }

      setSpecificOrg(organizationData.organizationName);
      setOrganizationData(ResetOrgRegData);
      router.push(`/Createorganization/create-a-bootcamp`);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionError("Failed to process transaction. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="lg:h-[500px] w-full flex flex-col items-center space-y-8 py-3">
      <div className="mx-auto w-full lg:w-auto pt-12">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to separate instructor emails
        </h1>
        <div className="flex flex-col w-full lg:flex-row justify-center space-x-3 items-center">
          <div className="lg:w-[590px] lg:h-[60px] w-full border-[2px] rounded-2xl mt-5">
            <Emailinput onEmailsChange={handleEmailsChange} />
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to separate wallet addresses
        </h1>
        <div className="flex space-x-3 items-center">
          <div className="w-[590px] h-[60px] border-[2px] rounded-2xl mt-5">
            <Addressinput onAddressChange={handleAddressChange} />
          </div>
        </div>
      </div>

      <GaslessNotification
        isOpen={showGaslessNotification}
        onClose={() => setShowGaslessNotification(false)}
        onConfirm={() => {
          setShowGaslessNotification(false);
          handleMulticallRouting();
        }}
        isAvailable={isPaymasterAvailable && compatibility?.isCompatible}
      />

      <div className="text-center">
        {isPaymasterAvailable && compatibility?.isCompatible ? (
          <div className="text-green-600 text-sm mb-2">
            Gasless transactions available
          </div>
        ) : (
          <div className="text-amber-600 text-sm mb-2">
            Using standard transaction method (gas fees apply)
          </div>
        )}
      </div>

      <Button
        onClick={handleMulticallRouting}
        disabled={uploading || gaslessLoading}
        className="w-[342px] h-[47px] mt-8 flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
      >
        {uploading || gaslessLoading
          ? "Processing..."
          : "Create your first bootcamp"}
      </Button>

      {transactionError && (
        <div className="text-red-500 text-sm mt-2">{transactionError}</div>
      )}
    </div>
  );
};

export default AddInstructor;
