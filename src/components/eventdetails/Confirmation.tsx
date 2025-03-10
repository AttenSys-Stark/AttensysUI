import React from "react";
import clsx from "clsx";
import checkmark from "@/assets/checkmark.svg";
import Image from "next/image";
import exclaim from "@/assets/exclaim.svg";
import Logo from "@/assets/Logo.svg";
import { Button } from "@headlessui/react";
import {
  modalstatus,
  orguploadstatus,
  confirmationstatus,
  sendingstatus,
  successstatus,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import LoadingSpinner from "../ui/LoadingSpinner";

const Confirmation = () => {
  const [confirmationstat, setConfirmationStat] = useAtom(confirmationstatus);

  const [sendingstat, setsendingstat] = useAtom(sendingstatus);
  const [successstat, setsuccessstat] = useAtom(successstatus);

  const handleConfirmation = () => {
    setConfirmationStat(false);
    setsendingstat(true);

    setTimeout(() => {
      setsendingstat(false);
      setsuccessstat(true);
    }, 2000);
  };

  return (
    <>
      <h1 className="text-center text-[18px] pt-4 md:pt-0 text-[#2D3A4B] leading-[26px] font-semibold">
        Transaction Confimation
      </h1>
      <div className="flex md:px-16 md:space-x-4 mt-4 w-[90%] mx-auto md:gap-14 md:flex-row flex-col">
        <div className=" space-y-6">
          <h1 className="text-[#2D3A4B] text-[16px] font-normal leading-[23px]">
            Organization Name{" "}
          </h1>
          <div className="w-full max-w-lg">
            <div
              className={clsx(
                "flex justify-between h-[55px] border-[2px] border-[#D0D5DD] w-full rounded-lg bg-white/5 py-1.5 px-8 text-[#2D3A4B] items-center",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              )}
            >
              <h1 className="text-[14px] font-medium leading-[16px]">
                Banxa io
              </h1>
            </div>
          </div>
          <h1 className="text-[#2D3A4B] text-[16px] font-normal leading-[23px]">
            You are about to send :
          </h1>
          <h1 className="text-[#5801A9] font-bold text-[37px] leading-[54px]">
            1000 USDT
          </h1>

          <div className="w-full max-w-lg space-y-4">
            <h1 className="text-[#2D3A4B] text-[16px] font-normal leading-[23px]">
              To{" "}
              <span className="text-[#2D3A4B] text-[16px] font-semibold leading-[23px]">
                Afrika 2.0 conference
              </span>
            </h1>
            <div
              className={clsx(
                "flex justify-between h-[55px] border-[2px] border-[#9B51E0] w-full rounded-lg bg-white/5 py-1.5 px-8 text-[#9B51E0] items-center",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              )}
            >
              <h1 className="text-[14px] font-medium leading-[16px]">
                0x5c956e61...de5232dc11
              </h1>
              <Image src={checkmark} alt="check" />
            </div>
          </div>
          <div className="flex space-x-4 md:pt-20">
            <Image src={exclaim} alt="disclaim" />
            <p className="text-[#5801A9] text-[13px] font-medium leading-[20px]">
              All sponsorship funds will undergo a verification <br /> process
              before being reflected on the platform.
            </p>
          </div>
        </div>

        <div className="md:w-[50%] space-y-6 flex flex-col items-center justify-center">
          <div className="flex flex-col mt-8 md:mt-0 md:fixed justify-center items-center">
            <h1 className="text-[14px] text-[#2D3A4B] font-semibold">
              Powered by{" "}
            </h1>
            <Image src={Logo} alt="logo" className="h-[31px] w-[117px]" />
          </div>
          <div className="w-full md:pt-[420px]">
            <Button
              onClick={!sendingstat ? handleConfirmation : undefined}
              disabled={sendingstat}
              className={`justify-center flex rounded-lg px-4 h-[50px] items-center w-full text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700 ${
                sendingstat ? "bg-[#357ABD] cursor-not-allowed" : "bg-[#4A90E2]"
              }`}
            >
              {sendingstat ? (
                <LoadingSpinner size="sm" colorVariant="white" />
              ) : (
                "Confirm Sponsorship"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirmation;
