import React, { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import add from "@/assets/add.svg";
import {
  walletStarknetkitNextAtom,
  organzationInitState,
  isinputError,
} from "@/state/connectedWalletStarknetkitNext";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import Category from "./Category";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { pinata } from "../../../utils/config";
import backArrow from "../../../public/backArrow.svg";

const Basicinfo = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logofileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [inputError, setInputError] = useState(false);
  const [logoinputError, setlogoiInputError] = useState(false);
  const [orgnameinputError, setorgnameiInputError] = useState(false);
  const [orgdescriptioninputError, setorgdescriptioniInputError] =
    useState(false);
  const [categoryinputError, setCategoryInputError] = useAtom(isinputError);

  const handleLogoImageClick = () => {
    // Trigger the file input on image click
    logofileInputRef.current?.click();
  };

  const handleImageClick = () => {
    // Trigger the file input on image click
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      }));
      setInputError(false);
    } else {
      console.error("Please select a valid image file (JPEG, JPG, or PNG).");
    }
  };

  const handlelogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      }));
      setlogoiInputError(false);
    } else {
      console.error("Please select a valid image file (JPEG, JPG, or PNG).");
    }
  };

  const handlerouting = (prop: string) => {
    // Track whether all validations pass
    let isValid = true;
    if (!fileInputRef.current?.files?.length) {
      setInputError(true); // Set error if no file is selected
      isValid = false;
    } else {
      setInputError(false);
    }
    if (!logofileInputRef.current?.files?.length) {
      setlogoiInputError(true); // Set error if no logo file is selected
      isValid = false;
    } else {
      setlogoiInputError(false);
    }
    if (!organizationData.organizationName.trim()) {
      setorgnameiInputError(true); // Set error if organization name is empty
      isValid = false;
    } else {
      setorgnameiInputError(false);
    }
    if (!organizationData.organizationDescription.trim()) {
      setorgdescriptioniInputError(true);
      isValid = false;
    } else {
      setorgdescriptioniInputError(false);
    }
    if (!organizationData.organizationCategory.trim()) {
      setCategoryInputError(true);
      isValid = false;
    }
    // Proceed with navigation if all validations pass
    if (isValid) {
      router.push(`/Createorganization/${prop}`);
    }
  };

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationName: e.target.value, // Dynamically update the specific field
    }));
    setorgnameiInputError(false);
  };

  const handleOrgDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationDescription: e.target.value, // Dynamically update the specific field
    }));
    setorgdescriptioniInputError(false);
  };

  // console.dir(organizationData, {depth:null})

  return (
    <div className="space-y-10 lg:space-y-20 ">
      <div className="space-y-5">
        <div className="flex space-x-3 text-purple-500 lg:hidden">
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
        {inputError && (
          <p className="text-red-400 text-[13px]">* File is required</p>
        )}
      </div>

      <div className="block lg:space-x-4 lg:flex">
        <div className="lg:w-[60%] w-full lg:space-y-16 space-y-8">
          <div className="w-full space-y-3">
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
                )}
              />
            </Field>
            {orgnameinputError && (
              <p className="text-red-400 text-[13px]">* Required</p>
            )}
            <p className="text-[14px] w-full text-[#2D3A4B] font-light leading-[23px] max-w-[90%]">
              Once chosen Organization name will be unchangeable for the next 3
              months{" "}
            </p>
          </div>

          <div className="w-full space-y-3">
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
                )}
              />
            </Field>
            {orgdescriptioninputError && (
              <p className="text-red-400 text-[13px]">* Required</p>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-[16px] text-[#2D3A4B] font-light leading-[23px]">
              Organization Category
            </h1>
            <Category />
            {categoryinputError && (
              <p className="text-red-400 text-[13px]">* Required</p>
            )}
          </div>
        </div>

        <div className="lg:w-[40%] w-full mt-8 lg:mt-0 flex flex-col px-0 lg:px-4 lg:justify-center lg:items-center space-y-8">
          <div className="w-full m-0 space-y-5 lg:w-auto">
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
            {logoinputError && (
              <p className="text-red-400 text-[13px]">* File is required</p>
            )}
          </div>

          <p className="text-[14px] w-full lg:w-[342px] text-[#2D3A4B] font-light leading-[23px]">
            Upload size must be less than 10MB | Best upload dimension is 500px
            x 500px
          </p>
          <Button
            onClick={() => {
              handlerouting("wallet-info");
            }}
            className="lg:w-[342px] w-full h-[47px] flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Basicinfo;
