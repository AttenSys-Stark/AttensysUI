import React, { useState } from "react"
import Emailinput from "../overview/Emailinput"
import { Button } from "@headlessui/react"
import cross from "@/assets/cross.svg"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Addressinput from "./Addressinput"
import {
  walletStarknetkitNextAtom,
  organzationInitState,
} from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"
import { pinata } from "../../../utils/config"
import { attensysOrgAddress } from "../../deployments/contracts"
import { attensysOrgAbi } from "../../deployments/abi"
import { Contract } from "starknet"
import plus from "../../../public/plus.svg"

import { FileObject } from "pinata"
const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0)
  },
}
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
}

const Addinstructor = (props: any) => {
  const { connectorDataAccount } = props
  const [emailList, setEmailList] = useState<string[]>([])
  const [AddressList, setAddressList] = useState<string[]>([])
  const [organizationData, setOrganizationData] = useAtom(organzationInitState)
  const [uploading, setUploading] = useState(false)
  const [cidToContract, setCidToContract] = useState<string>("")

  // console.dir(organizationData, {depth : null})

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails)
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationInstructorEmails: emails, // Dynamically update the specific field
    }))
  }
  const handleAddresssChange = (addr: string[]) => {
    setAddressList(addr)
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationInstructorsWalletAddresses: addr, // Dynamically update the specific field
    }))
  }
  const router = useRouter()

  //handles routing and pinata interaction
  const handlerouting = async () => {
    setUploading(true)
    const OrgBannerupload = await pinata.upload.file(
      organizationData.organizationBanner,
    )
    const OrgLogoUpload = await pinata.upload.file(
      organizationData.organizationLogo,
    )
    const Dataupload = await pinata.upload.json({
      OrganizationName: organizationData.organizationName,
      OrganizationDescription: organizationData.organizationDescription,
      OrganizationBannerCID: OrgBannerupload.cid,
      OrganizationLogoCID: OrgLogoUpload.cid,
      OrganizationCategory: organizationData.organizationCategory,
      OrganizationAdminName: organizationData.organizationAdminfullname,
      OrganizationAdminEmail: organizationData.organizationAminEmail,
      OrganizationAminWalletAddress: organizationData.organizationAdminWallet,
      OrganizationInstructorEmails:
        organizationData.organizationInstructorEmails,
      OrganizationInstructorWalletAddresses:
        organizationData.organizationInstructorsWalletAddresses,
    })
    //@todo reset all data field after pinata data upload is successful
    if (Dataupload) {
      console.log("Data upload here", Dataupload)
      console.log("Cid to send to contract", Dataupload.cid)
      setCidToContract(Dataupload.cid)
      setUploading(false)
    }
  }

  // function to handle multicall of create_org and add_instructor functions from contract
  const handleMulticall = async (prop: string) => {
    // invoke first the handleRouting to upload data to pinata
    handlerouting()

    //initialize provider with a Sepolia Testnet node
    const organizationContract = new Contract(
      attensysOrgAbi,
      attensysOrgAddress,
      connectorDataAccount,
    )

    const create_org_calldata = organizationContract.populate(
      "create_org_profile",
      [
        organizationData.organizationName,
        // @ts-ignore
        cidToContract,
      ],
    )

    const add_instructor_calldata = organizationContract.populate(
      "add_instructor_to_org",
      [organizationData.organizationInstructorsWalletAddresses[0]],
    )

    //@ts-ignore
    const multiCall = await connectorDataAccount.executeImpl([
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
    ])

    //@ts-ignore
    connectorDataAccount?.provider
      .waitForTransaction(multiCall.transaction_hash)
      .then(() => {})
      .catch((e: any) => {
        console.log("Error: ", e)
      })
      .finally(() => {
        //Resets all org data input
        setOrganizationData(ResetOrgRegData)
        router.push(`/Createorganization/${prop}`)
      })
  }

  return (
    <div className="lg:h-[500px] w-full flex flex-col items-center space-y-8 py-3">
      <div className="mx-auto w-full lg:w-auto pt-12">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate instructor emails
        </h1>
        <div className="flex flex-col w-full lg:flex-row justify-center  space-x-3 items-center">
          <div className="lg:w-[590px] lg:h-[60px] w-full border-[2px] rounded-2xl mt-5">
            <Emailinput onEmailsChange={handleEmailsChange} />
          </div>
          <Button className="bg-[#4A90E21F] text-[#5801A9] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
            <Image src={plus} alt="drop" className="mr-2" />
            Send invite
          </Button>
        </div>
      </div>

      <Button
        onClick={() => {
          handleMulticall("create-a-bootcamp")
        }}
        className="w-[342px] h-[47px] mt-8 flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
      >
        {uploading ? "Uploading..." : "Create your first course"}
      </Button>
    </div>
  )
}

export default Addinstructor
