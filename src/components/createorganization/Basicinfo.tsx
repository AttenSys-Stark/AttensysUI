import React, { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import add from "@/assets/add.svg"
import {
  walletStarknetkitNextAtom,
  organzationInitState,
} from "@/state/connectedWalletStarknetkitNext"
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react"
import clsx from "clsx"
import Category from "./Category"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { pinata } from "../../../utils/config"
import backArrow from "../../../public/backArrow.svg"

const Basicinfo = () => {
  // Add state for validation errors
  const [errors, setErrors] = useState({
    organizationName: "",
    organizationDescription: "",
    organizationBanner: "",
    organizationLogo: "",
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const logofileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const [organizationData, setOrganizationData] = useAtom(organzationInitState)

  const handleLogoImageClick = () => {
    // Trigger the file input on image click
    logofileInputRef.current?.click()
  }

  const handleImageClick = () => {
    // Trigger the file input on image click
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      // Process the file
      setOrganizationData((prevData) => ({
        ...prevData, // Spread existing data to retain untouched fields
        organizationBanner: file, // Dynamically update the specific field
      }))
      // Clear banner error when a valid file is selected
      setErrors((prev) => ({ ...prev, organizationBanner: "" }))
    } else {
      setErrors((prev) => ({
        ...prev,
        organizationBanner:
          "Please select a valid image file (JPEG, JPG, or PNG).",
      }))
    }
  }

  const handlelogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      // Process the file
      setOrganizationData((prevData) => ({
        ...prevData, // Spread existing data to retain untouched fields
        organizationLogo: file, // Dynamically update the specific field
      }))
      // Clear logo error when a valid file is selected
      setErrors((prev) => ({ ...prev, organizationLogo: "" }))
    } else {
      setErrors((prev) => ({
        ...prev,
        organizationLogo:
          "Please select a valid image file (JPEG, JPG, or PNG).",
      }))
    }
  }

  const handlerouting = (prop: string) => {
    const newErrors = {
      organizationName: !organizationData.organizationName
        ? "Organization name is required"
        : "",
      organizationDescription: !organizationData.organizationDescription
        ? "Organization description is required"
        : "",
      organizationBanner: !organizationData.organizationBanner
        ? "Organization banner is required"
        : "",
      organizationLogo: !organizationData.organizationLogo
        ? "Organization logo is required"
        : "",
    }

    setErrors(newErrors)

    // Only route if no errors
    if (Object.values(newErrors).every((error) => error === "")) {
      router.push(`/Createorganization/${prop}`)
    }
  }

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationName: newValue,
    }))

    // Clear or set name error based on input
    setErrors((prev) => ({
      ...prev,
      organizationName: !newValue ? "Organization name is required" : "",
    }))
  }

  const handleOrgDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setOrganizationData((prevData) => ({
      ...prevData,
      organizationDescription: newValue,
    }))

    // Clear or set description error based on input
    setErrors((prev) => ({
      ...prev,
      organizationDescription: !newValue
        ? "Organization description is required"
        : "",
    }))
  }

  return (
    <div className="lg:space-y-20 space-y-10  ">
      <div className="space-y-5">
        <div className=" lg:hidden text-purple-500 flex space-x-3">
          <Image src={backArrow} alt="back arrow" />
          <p className="text-lg font-extrabold">Basic Info</p>
        </div>
        <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
          Upload Organization Banner
        </h1>
        <div
          className="w-full h-[224px] bg-[#3F3E58] rounded-xl flex justify-center items-center cursor-pointer"
          onClick={handleImageClick}
        >
          <Image src={add} alt="add" className="cursor-pointer" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the input
          />
        </div>
        {errors.organizationBanner && (
          <p className="text-red-500 text-sm mt-2">
            {errors.organizationBanner}
          </p>
        )}
      </div>

      <div className="lg:flex block space-x-4">
        <div className="lg:w-[60%] w-full lg:space-y-16 space-y-8">
          <div className="space-y-3 w-full">
            <h1 className="text-[16px] text-[#2D3A4B] font-semibold leading-[23px]">
              Organization Name
            </h1>
            <Field>
              <Input
                placeholder="Organization name"
                onChange={handleOrgNameChange}
                className={clsx(
                  "h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block lg:w-[90%] w-full rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  errors.organizationName ? "border-red-500" : "",
                )}
              />
            </Field>
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-2">
                {errors.organizationName}
              </p>
            )}
            <p className="text-[14px] w-full text-[#2D3A4B] font-light leading-[23px]">
              Once chosen Organization name will be unchangeable for the next 3
              months{" "}
            </p>
          </div>

          <div className="space-y-3 w-full">
            <h1 className="text-[16px] font-semibold text-[#2D3A4B] leading-[23px]">
              Organization Description
            </h1>
            <Field>
              <textarea
                placeholder="A short overview of what the organization does, its focus areas..."
                onChange={handleOrgDescriptionChange}
                className={clsx(
                  "h-[246px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block lg:w-[90%] w-full rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  errors.organizationDescription ? "border-red-500" : "",
                )}
              />
            </Field>
            {errors.organizationDescription && (
              <p className="text-red-500 text-sm mt-2">
                {errors.organizationDescription}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
              Organization Category
            </h1>
            <Category />
          </div>
        </div>

        <div className="lg:w-[40%] w-full mt-8 lg:mt-0 flex flex-col  lg:justify-center lg:items-center space-y-8">
          <div className="space-y-5 m-0 w-full lg:w-auto">
            <h1 className="text-[16px] text-[#2D3A4B] font-semibold leading-[23px]">
              Organization Logo
            </h1>
            <div
              className="lg:w-[342px] w-full h-[320px] bg-[#3F3E58] rounded-xl flex justify-center items-center cursor-pointer"
              onClick={handleLogoImageClick}
            >
              <Image src={add} alt="add" className="cursor-pointer" />
              <input
                ref={logofileInputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handlelogoFileChange}
                style={{ display: "none" }} // Hide the input
              />
            </div>
            {errors.organizationLogo && (
              <p className="text-red-500 text-sm mt-2">
                {errors.organizationLogo}
              </p>
            )}
          </div>

          <p className="text-[14px] w-full lg:w-[342px] text-[#2D3A4B] font-light leading-[23px]">
            Upload size must be less than 10MB | Best upload dimension is 500px
            x 500px
          </p>
          <Button
            onClick={() => {
              handlerouting("wallet-info")
            }}
            className="lg:w-[342px] w-full h-[47px] flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Basicinfo
