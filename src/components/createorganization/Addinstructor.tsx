import React, { useState } from "react";
import Emailinput from "../overview/Emailinput";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Addressinput from "./Addressinput";
import { organzationInitState } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { pinata } from "../../../utils/config";
import { attensysOrgAddress } from "../../deployments/contracts";
import { attensysOrgAbi } from "../../deployments/abi";
import { Contract } from "starknet";
import { specificOrgRoute } from "@/state/connectedWalletStarknetkitNext";

import type { FileObject } from "pinata";
import { provider } from "@/constants";
import { useWallet } from "@/hooks/useWallet";
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
  const { wallet, session, sessionAccount, sessionKeyMode } = useWallet();
  const [emailList, setEmailList] = useState<string[]>([]);
  const [AddressList, setAddressList] = useState<string[]>([]);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [specificOrg, setSpecificOrg] = useAtom(specificOrgRoute);
  const [uploading, setUploading] = useState(false);
  // const [cidToContract, setCidToContract] = useState<string>("")

  // console.dir(organizationData, {depth : null})

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
    try {
      setUploading(true);

      // Upload images to Pinata
      const OrgBannerupload = await pinata.upload.file(
        organizationData.organizationBanner,
      );
      const OrgLogoUpload = await pinata.upload.file(
        organizationData.organizationLogo,
      );

      console.log("org data here", organizationData);

      // Upload JSON metadata to Pinata
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

      if (!Dataupload) {
        throw new Error("Data upload to Pinata failed.");
      }

      console.log("Data upload here", Dataupload);
      console.log("Cid to send to contract", Dataupload.IpfsHash);

      // Initialize organization contract
      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        provider,
      );

      // Helper function for populating contract calldata
      const populateCalldata = (method: string, args: any[]) =>
        organizationContract.populate(method, args).calldata;

      // Prepare calldata for smart contract calls
      const create_org_calldata = populateCalldata("create_org_profile", [
        organizationData.organizationName,
        Dataupload.IpfsHash,
      ]);

      const add_instructor_calldata = populateCalldata(
        "add_instructor_to_org",
        [
          organizationData.organizationInstructorsWalletAddresses,
          organizationData.organizationName,
        ],
      );

      let multiCall: { transaction_hash: string };

      if (sessionKeyMode && session && sessionAccount) {
        multiCall = await sessionAccount.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "create_org_profile",
            calldata: create_org_calldata,
          },
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_instructor_to_org",
            calldata: add_instructor_calldata,
          },
        ]);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        multiCall = await wallet.account.execute([
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "create_org_profile",
            calldata: create_org_calldata,
          },
          {
            contractAddress: attensysOrgAddress,
            entrypoint: "add_instructor_to_org",
            calldata: add_instructor_calldata,
          },
        ]);
      }

      // Wait for transaction confirmation
      await provider.waitForTransaction(multiCall.transaction_hash);

      setSpecificOrg(organizationData.organizationName);
      setOrganizationData(ResetOrgRegData);
      router.push(`/Createorganization/create-a-bootcamp`);
    } catch (e) {
      console.error("Error in handle_multicall_routing:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="lg:h-[500px] w-full flex flex-col items-center space-y-8 py-3">
      <div className="w-full pt-12 mx-auto lg:w-auto">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate instructor emails
        </h1>
        <div className="flex flex-col items-center justify-center w-full space-x-3 lg:flex-row">
          <div className="lg:w-[590px] lg:h-[60px] w-full border-[2px] rounded-2xl mt-5">
            <Emailinput onEmailsChange={handleEmailsChange} />
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate wallet addresses
        </h1>
        <div className="flex items-center space-x-3">
          <div className="w-[590px] h-[60px] border-[2px] rounded-2xl mt-5">
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
        className="w-[342px] h-[47px] mt-8 flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
      >
        {uploading ? "Uploading..." : "Create your first bootcamp"}
      </Button>
    </div>
  );
};

export default Addinstructor;
