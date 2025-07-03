"use client";
import book from "@/assets/book.svg";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";

const MobileStudentRegisteredCard = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const getIpfsData = async () => {
    try {
      const data = await fetchCIDContent(props?.info?.student_details_uri);
      //@ts-ignore
      setEmail(data?.data?.student_email);
      //@ts-ignore
      setName(data?.data?.student_name);
    } catch (error) {
      // Handle error silently
    }
  };
  useEffect(() => {
    getIpfsData();
  }, [wallet]);

  function truncateAddress(address: any): string {
    let formatedAddress = decimalToHexAddress(address);

    const start = formatedAddress?.slice(0, 10);
    const end = formatedAddress?.slice(-10);
    return `${start}...${end}`;
  }

  function decimalToHexAddress(decimalAddress: any) {
    // Convert decimal address to hex removing any decimal points
    let hexAddress = BigInt(decimalAddress).toString(16);

    //Ensure the address is 64 characters long (32 bytes)
    hexAddress = hexAddress.padStart(64, "0");

    // Add 0x prefix
    return "0x" + hexAddress;
  }

  return (
    <div className="w-full bg-white border border-[#DADADA] rounded-[15px] py-7 px-5 space-y-3 relative">
      <div className="flex items-center justify-between ">
        <p className="text-[14px] leading-[17px] font-medium">{name}</p>
        {props.arg === "check" ? (
          <div className="bg-[#ADFFCA] rounded-[5px] px-[10px] py-[5px] text-[#115E2C] font-normal text-xs">
            Approved
          </div>
        ) : (
          <div className="bg-[#FFCACA] rounded-[5px] px-[10px] py-[5px] text-red-900 font-normal text-xs">
            Declined
          </div>
        )}
      </div>
      <div className="flex items-center justify-between  ">
        <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
          {email}
        </p>
        <div className="flex items-center gap-3">
          <Image height={24} width={24} src={book} alt="progress" />
          <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
            100%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between ">
        <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
          {truncateAddress(props?.info?.address_of_student)}
        </p>
        <div className="flex items-center gap-3">
          <Image height={24} width={24} src={book} alt="progress" />
          <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
            100%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentRegisteredCard;
