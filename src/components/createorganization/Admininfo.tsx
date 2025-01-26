import React from "react"
import { Button, Field, Input } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { organzationInitState } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"

const Admininfo = () => {
  const router = useRouter()
  const [organizationData, setOrganizationData] = useAtom(organzationInitState)

  // console.dir(organizationData, {depth : null})

  const handlerouting = (prop: string) => {
    router.push(`/Createorganization/${prop}`)
  }
  const handleAdminNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAdminfullname: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleEmailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAminEmail: e.target.value, // Dynamically update the specific field
    }))
  }

  const handleWalletAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationData((prevData) => ({
      ...prevData, // Spread existing data to retain untouched fields
      organizationAdminWallet: e.target.value, // Dynamically update the specific field
    }))
  }

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
          <button className="absolute right-2 top-1/2 -translate-y-1/2  bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white px-5 py-2 rounded-lg text-sm font-medium">
            Confirm address
          </button>
        </div>
      </div>

      {/* Wallet Address Section */}
      <div className="space-y-3 w-full max-w-[500px]">
        <h1 className="text-[14px] sm:text-[16px] text-[#2D3A4B] font-normal leading-[20px] sm:leading-[23px]">
          Admin Wallet address
        </h1>
        <div className="">
          <div className="flex justify-between items-center border-[1px] sm:border-[2px] border-[#9B51E0] rounded-lg bg-white p-2 sm:p-3">
            <span className="text-[#9B51E0] text-sm flex-1 truncate">
              0x5c956e61...de5232dc11
            </span>
            <div className="flex justify-center items-center">
              <svg
                className="w-5 h-5 text-green-500 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <button className=" ml-0 lg:ml-4 hidden lg:block right-2 top-1/2   bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white px-5 py-2 rounded-lg text-sm font-medium">
                Change address
              </button>
            </div>
          </div>
          <button className=" block lg:hidden float-end mt-4 bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white px-5 py-2 rounded-lg text-sm font-medium">
            Change address
          </button>
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
  )
}

export default Admininfo
