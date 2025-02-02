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
  const [errors, setErrors] = useState<{
    emails?: string
    organizationFields?: string
  }>({})

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails)
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationInstructorEmails: emails,
    }))
    // Clear error when user starts typing
    if (errors.emails) {
      setErrors((prev) => ({ ...prev, emails: undefined }))
    }
  }

  const handleAddresssChange = (addr: string[]) => {
    setAddressList(addr)
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationInstructorsWalletAddresses: addr,
    }))
  }

  const router = useRouter()

  const validateFields = () => {
    const newErrors: { emails?: string; organizationFields?: string } = {}

    // Check if emails are provided
    if (!emailList.length || (emailList.length === 1 && emailList[0] === "")) {
      newErrors.emails = "At least one instructor email is required"
    }

    // Check organization fields
    if (
      !organizationData.organizationName ||
      !organizationData.organizationDescription ||
      !organizationData.organizationCategory ||
      !organizationData.organizationAdminfullname ||
      !organizationData.organizationAminEmail ||
      !organizationData.organizationAdminWallet
    ) {
      newErrors.organizationFields = "All organization fields are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlerouting = async () => {
    if (!validateFields()) {
      return false
    }

    setUploading(true)
    try {
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

      if (Dataupload) {
        console.log("Data upload here", Dataupload)
        console.log("Cid to send to contract", Dataupload.cid)
        setCidToContract(Dataupload.cid)
        setUploading(false)
        return true
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploading(false)
      return false
    }
    return false
  }

  const handleMulticall = async (prop: string) => {
    const uploadSuccess = await handlerouting()
    if (!uploadSuccess) return

    try {
      const organizationContract = new Contract(
        attensysOrgAbi,
        attensysOrgAddress,
        connectorDataAccount,
      )

      const create_org_calldata = organizationContract.populate(
        "create_org_profile",
        [organizationData.organizationName, cidToContract],
      )

      const add_instructor_calldata = organizationContract.populate(
        "add_instructor_to_org",
        [organizationData.organizationInstructorsWalletAddresses[0]],
      )

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

      connectorDataAccount?.provider
        .waitForTransaction(multiCall.transaction_hash)
        .then(() => {
          setOrganizationData(ResetOrgRegData)
          router.push(`/Createorganization/${prop}`)
        })
        .catch((e: any) => {
          console.log("Error: ", e)
        })
    } catch (error) {
      console.error("Contract interaction error:", error)
    }
  }

  return (
    <div className="lg:h-[500px] w-full flex flex-col items-center space-y-8 py-3">
      <div className="mx-auto w-full lg:w-auto pt-12">
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Use commas (,) to seperate instructor emails
        </h1>
        <div className="flex flex-col w-full lg:flex-row justify-center space-x-3 items-center">
          <div className="lg:w-[590px] lg:h-[60px] w-full border-[2px] rounded-2xl mt-5">
            <Emailinput onEmailsChange={handleEmailsChange} />
            {errors.emails && (
              <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
            )}
          </div>
          <Button className="bg-[#4A90E21F] text-[#5801A9] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
            <Image src={plus} alt="drop" className="mr-2" />
            Send invite
          </Button>
        </div>
      </div>

      {errors.organizationFields && (
        <p className="text-red-500 text-sm">{errors.organizationFields}</p>
      )}

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
