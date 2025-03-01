"use client";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { pinata } from "../../../utils/config";

const Studentlist = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const getIpfsData = async () => {
    try {
      const data = await pinata.gateways.get(props?.info?.student_details_uri);
      console.log("student data", data);
      //@ts-ignore
      setEmail(data?.data?.student_email);
      //@ts-ignore
      setName(data?.data?.student_name);
    } catch (error) {
      console.log(error);
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
    <tbody>
      <tr>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          {email}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#333333]">
          {name}
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] text-[14px] font-medium leading-[23px] text-[#9B51E0]">
          {truncateAddress(props?.info?.address_of_student)}
        </td>
        {props.arg === "check" ? (
          <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-[#115E2C]">
            Approved
          </td>
        ) : (
          <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-red-900">
            Declined
          </td>
        )}
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-[#9B51E0]">
          100%
        </td>
        <td className="px-4 py-2 text-center border-b-[#B8B9BA] border-b-[1px] font-medium leading-[23px] text-[#9B51E0]">
          100%
        </td>
      </tr>
    </tbody>
  );
};

export default Studentlist;
