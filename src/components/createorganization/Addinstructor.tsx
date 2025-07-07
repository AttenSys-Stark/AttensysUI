import React, { useEffect, useState } from "react";
import Emailinput from "../overview/Emailinput";
import { Button } from "@headlessui/react";
import cross from "@/assets/cross.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Addressinput from "./Addressinput";
import {
  walletStarknetkitNextAtom,
  organzationInitState,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { pinata } from "../../../utils/config";
import { attensysOrgAddress } from "../../deployments/contracts";
import { attensysOrgAbi } from "../../deployments/abi";
import { Contract } from "starknet";
import plus from "../../../public/plus.svg";
import { specificOrgRoute } from "@/state/connectedWalletStarknetkitNext";

import { FileObject } from "pinata";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
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

const Addinstructor = (props: any) => {
  // const { connectorDataAccount } = props;
  const [emailList, setEmailList] = useState<string[]>([]);
  const [AddressList, setAddressList] = useState<string[]>([]);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [specificOrg, setSpecificOrg] = useAtom(specificOrgRoute);
  const [uploading, setUploading] = useState(false);
  const [orgname, setOrgname] = useState<string>();
  const { account, address } = useFirebaseAuth();
  // const { connect, connectors } = useConnect();
  // const controller = connectors[0] as ControllerConnector;
  // const [cidToContract, setCidToContract] = useState<string>("")

  // useEffect(() => {
  //   if (!address) return;
  //   controller.username()?.then((n) => setOrgname(n));
  //   console.log(address, "address");
  // }, [address, controller]);

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails);
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationInstructorEmails: emails, // Dynamically update the specific field
    }));
  };
  const handleAddresssChange = (addr: string[]) => {
    setAddressList(addr);
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationInstructorsWalletAddresses: addr, // Dynamically update the specific field
    }));
  };
  const router = useRouter();

  //handles routing and pinata interaction
  // function to handle multicall of create_org and add_instructor functions from contract
  const handle_multicall_routing = async () => {
    setUploading(true);
    // if (!account || !address) return
    try {
      const OrgBannerupload = await pinata.upload.file(
        organizationData.organizationBanner,
      );
      const OrgLogoUpload = await pinata.upload.file(
        organizationData.organizationLogo,
      );
      console.log("org data here", organizationData);
      const Dataupload = await pinata.upload.json({
        OrganizationName: organizationData.organizationName,
        OrganizationDescription: organizationData.organizationDescription,
        OrganizationBannerCID: OrgBannerupload.IpfsHash,
        OrganizationLogoCID: OrgLogoUpload.IpfsHash,
        OrganizationCategory: organizationData.organizationCategory,
        OrganizationAdminName: organizationData.organizationAdminfullname,
        OrganizationAdminEmail: organizationData.organizationAminEmail,
        OrganizationAminWalletAddress: organizationData.organizationAdminWallet,
        OrganizationInstructorEmails:
          organizationData.organizationInstructorEmails,
        OrganizationInstructorWalletAddresses:
          organizationData.organizationInstructorsWalletAddresses,
      });
      //@todo reset all data field after pinata data upload is successful
      if (Dataupload) {
        console.log("Data upload here", Dataupload);
        console.log("Cid to send to contract", Dataupload.IpfsHash);
        //initialize provider with a Sepolia Testnet node
        const organizationContract = new Contract(
          attensysOrgAbi,
          attensysOrgAddress,
          account,
        );

        const create_org_calldata = organizationContract.populate(
          "create_org_profile",
          [
            organizationData.organizationName,
            // @ts-ignore
            Dataupload.IpfsHash,
          ],
        );

        const add_instructor_calldata = organizationContract.populate(
          "add_instructor_to_org",
          [
            organizationData.organizationInstructorsWalletAddresses,
            organizationData.organizationName,
          ],
        );

        const multiCall = await account?.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "create_org_profile",
            calldata: create_org_calldata.calldata,
          },
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_instructor_to_org",
            calldata: add_instructor_calldata.calldata,
          },
        ]);
        if (!multiCall) {
          throw new Error("Transaction Execution failed");
        }
        await account?.waitForTransaction(multiCall?.transaction_hash);
        console.log("Done Submitting");
        setUploading(false);
        setOrganizationData(ResetOrgRegData);
        setSpecificOrg(organizationData.organizationName);
        router.push(`/Createorganization/create-a-bootcamp`);
      }
    } catch (error) {
      setUploading(false);
      console.error("An error occured: ", error);
    }
  };

  return (
    <div className="lg:h-auto w-full flex flex-col mx-auto items-center space-y-8 py-3">
      <div className="mx-auto pt-12">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate instructor emails
        </h1>
        <div className="flex flex-col w-full lg:flex-row justify-center space-x-3 items-center">
          <div className="w-full md:w-[600px] h-[60px] border-[2px] rounded-2xl mt-5">
            <Emailinput onEmailsChange={handleEmailsChange} />
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate wallet addresses
        </h1>
        <div className="flex space-x-3 items-center">
          <div className="w-full md:w-[600px] h-[60px] border-[2px] rounded-2xl mt-5">
            <Addressinput onAddressChange={handleAddresssChange} />
          </div>
          {/* <Button className='bg-[#4A90E21F] text-[#5801A9] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5'>
                            <Image src={cross} alt='drop' className='mr-2'/>
                            Send invite</Button>    */}
        </div>
      </div>
      <Button
        onClick={() => {
          handle_multicall_routing();
        }}
        disabled={uploading}
        className={`mx-auto w-auto px-16 md:w-[600px] h-[60px] mt-8 flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] rounded-xl ${
          uploading ? "bg-[#357ABD] cursor-not-allowed" : "bg-[#4A90E2]"
        }`}
      >
        {uploading ? (
          <LoadingSpinner size="sm" colorVariant="white" />
        ) : (
          "Create your first bootcamp"
        )}
      </Button>
    </div>
  );
};

export default Addinstructor;
