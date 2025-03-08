import React, { useEffect, useState } from "react";
import Image from "next/image";
import blucecirle from "@/assets/bluecircle.svg";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import eventlog from "@/assets/eventlogo.svg";
import fire from "@/assets/fire.svg";
import { CiLocationOn } from "react-icons/ci";
import { pinata } from "../../../utils/config";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { decimalToHexAddress, FormatDateFromUnix } from "@/utils/formatAddress";
import { useRouter } from "next/navigation";

interface MyeventCardProp {
  todaydate: string;
  time: string;
  eventname: string;
  host: string;
  location: string;
}

const Eventcard = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [location, setLocation] = useState("");
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");

  let defaultDate = today(getLocalTimeZone());
  const router = useRouter();

  // let [focusedDate, setFocusedDate] = useState<DateValue>(defaultDate);

  const obtainCIDdata = async (CID: string) => {
    try {
      const data = await pinata.gateways.get(CID);
      //@ts-ignore
      console.info("event_uri here", data?.data);
      //@ts-ignore
      const logoData: GetCIDResponse = await pinata.gateways.get(
        //@ts-ignore
        data?.data?.eventDesign,
      );
      const objectURL = URL.createObjectURL(logoData.data as Blob);
      //@ts-ignore
      setLogoImage(objectURL);
      //@ts-ignore
      setLocation(data?.data?.location);
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  useEffect(() => {
    obtainCIDdata(props.uri);
  }, [wallet]);

  const readableDate = (arg: any) => {
    return new Date(Number(arg) * 1000).toLocaleString();
  };

  const shortenAddress = (address: string) => {
    const formattedAddress = decimalToHexAddress(address);
    if (!formattedAddress) return "unavailable";
    return `${formattedAddress.slice(0, 8)}...${formattedAddress.slice(-10)}`;
  };

  return (
    <div
      className="flex max-w-[747px] gap-4 relative px-4 mb-8 cursor-pointer"
      onClick={props.onClick}
    >
      <div className="flex flex-col justify-center items-center gap-1">
        <span className="bg-[#4A90E2] w-2 h-2 rounded-full" />
        <span className="h-full w-[2px] bg-[#776666]" />
        <span className="text-base font-medium absolute left-11 top-1 text-white"></span>
      </div>
      <div className="bg-[#3F3F3F52] w-full p-4 sm:p-10 text-white flex flex-col-reverse sm:flex-row justify-between gap-4 md:gap-0  rounded-md mt-8 border-[#FFFFFF9E] border">
        <div className="font-medium text-base grid gap-1 sm:gap-3">
          <h3> {readableDate(props.time.start_time)}</h3>
          <h2 className="font-bold text-xl">{props.eventname}</h2>
          <div className="flex items-center gap-2">
            <Image src={eventlog} alt="avater" className="rounded-2xl w-5" />
            <h3>{shortenAddress(props.organizers) ?? "0x00"}</h3>
          </div>
          <div className="flex items-center gap-2">
            <CiLocationOn className="w-5" />
            <span>{location ?? "unavailable"}</span>
          </div>
        </div>
        <div className="h-[123px] w-[123px] rounded-3xl relative">
          <Image
            src={logoImagesource}
            alt="image avater"
            className="rounded-3xl h-full w-full object-cover"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
};

export default Eventcard;

{
  /* <Calendar 
                                aria-label="Date (Controlled Focused Value)"
                                focusedValue={focusedDate}
                                value={defaultDate}
                                onFocusChange={setFocusedDate}
                                className=" text-white rounded-lg shadow-2xl p-4 h-[285px]"
                                /> */
}
