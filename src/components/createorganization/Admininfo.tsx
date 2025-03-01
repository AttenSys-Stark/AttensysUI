import React, { useState } from "react";
import { Button, Field, Input } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { organzationInitState } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const Admininfo = () => {
  const router = useRouter();
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [adminNameError, setAdminNameError] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState(false);
  const [adminwalletError, setAdminwalletError] = useState(false);

  // console.dir(organizationData, {depth : null})

  const handlerouting = (prop: string) => {
    let isValid = true;
    if (!organizationData.organizationAdminfullname.trim()) {
      setAdminNameError(true);
      isValid = false;
    } else {
      setAdminNameError(false);
    }
    if (!organizationData.organizationAminEmail.trim()) {
      setAdminEmailError(true);
      isValid = false;
    } else {
      setAdminEmailError(false);
    }
    if (!organizationData.organizationAdminWallet.trim()) {
      setAdminwalletError(true);
      isValid = false;
    } else {
      setAdminwalletError(false);
    }
    if (isValid) {
      router.push(`/Createorganization/${prop}`);
    }
  };
  const handleAdminNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAdminfullname: e.target.value, // Dynamically update the specific field
    }));
    setAdminNameError(false);
  };

  const handleEmailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAminEmail: e.target.value, // Dynamically update the specific field
    }));
    setAdminEmailError(false);
  };

  const handleWalletAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAdminWallet: e.target.value, // Dynamically update the specific field
    }));
    setAdminwalletError(false);
  };

  return (
    <div className="lg:min-h-screen w-full px-4 sm:px-6 flex flex-col items-center space-y-6 sm:space-y-8 py-6">
      {/* Admin's Full Name Section */}
      <div className="space-y-3 w-full max-w-[500px]">
        <h1 className="text-[14px] sm:text-[16px] text-[#2D3A4B] font-normal leading-[20px] sm:leading-[23px]">
          Admin&apos;s Full Name
        </h1>
        <Field>
          <Input
            placeholder="Your full name"
            onChange={handleAdminNameChange}
            className={clsx(
              "h-[45px] sm:h-[55px] border-[1px] sm:border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg py-1.5 px-3 text-sm text-[#667185]",
              "focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:border-transparent",
            )}
          />
        </Field>
        {adminNameError && (
          <p className="text-red-400 text-[13px]">* Required</p>
        )}
      </div>

      {/* Email Address Section */}
      <div className="space-y-3 w-full max-w-[500px]">
        <h1 className="text-[14px] sm:text-[16px] text-[#2D3A4B] font-normal leading-[20px] sm:leading-[23px]">
          Preferred Email Address
        </h1>
        <div className="relative">
          <Field>
            <Input
              placeholder="Enter email address"
              onChange={handleEmailAddressChange}
              className={clsx(
                "h-[45px] sm:h-[55px] border-[1px] sm:border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg py-1.5 px-3 text-sm text-[#667185]",
                "focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:border-transparent",
                "pr-[130px]", // Space for confirm button
              )}
            />
          </Field>
          {adminEmailError && (
            <p className="text-red-400 text-[13px]">* Required</p>
          )}
        </div>
      </div>

      {/* Wallet Address Section */}
      <div className="space-y-3 w-full max-w-[500px]">
        <h1 className="text-[14px] sm:text-[16px] text-[#2D3A4B] font-normal leading-[20px] sm:leading-[23px]">
          Admin Wallet address
        </h1>

        <div className="relative">
          <Field>
            <Input
              placeholder="Enter admin wallet address"
              onChange={handleWalletAddressChange}
              className={clsx(
                "h-[45px] sm:h-[55px] border-[1px] sm:border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-full rounded-lg py-1.5 px-3 text-sm text-[#667185]",
                "focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:border-transparent",
                "pr-[130px]", // Space for confirm button
              )}
            />
          </Field>
          {adminwalletError && (
            <p className="text-red-400 text-[13px]">* Required</p>
          )}
        </div>
      </div>

      {/* Verify Button */}
      <Button
        onClick={() => handlerouting("add-instructors")}
        className="w-full max-w-[342px] h-[47px] flex justify-center items-center text-white text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl mt-8"
      >
        Verify
      </Button>
    </div>
  );
};

export default Admininfo;
