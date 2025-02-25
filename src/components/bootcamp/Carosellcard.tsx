import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtom } from "jotai";
import { pinata } from "../../../utils/config";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { GetCIDResponse } from "pinata";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// interface CarousellCardProp {
//   name: string
//   time: string
//   flier: any
//   logo: any
//   action: string
//   height: string
//   width: string
// }

const Carosellcard = (props: any) => {
  const router = useRouter();
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");
  const [NFTImagesource, setNFTLogoImage] = useState<string | StaticImport>("");
  const [date, setDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleActionClick = async (arg: any) => {
    setIsNavigating(true);
    try {
      if (arg == "Register") {
        await router.push(
          `/Register/${props.name}/?id=${Number(props.alldata.bootcamp_id)}&org=${props.alldata.address_of_org}`,
        );
      } else if (arg == "Finished") {
        await router.push(
          `/Register/${props.name}/?id=${Number(props.alldata.bootcamp_id)}&org=${props.alldata.address_of_org}`,
        );
      } else if (arg == "Manage") {
        await router.push(`/Mybootcamps/${props.name}`);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  // console.log("ongoing data", props)

  const obtainCIDdata = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await pinata.gateways.get(CID);
      //@ts-ignore
      const logoData: GetCIDResponse = await pinata.gateways.get(
        //@ts-ignore
        data?.data?.BootcampLogo,
      );
      const objectURL = URL.createObjectURL(logoData.data as Blob);

      //@ts-ignore
      const nftData: GetCIDResponse = await pinata.gateways.get(
        //@ts-ignore
        data?.data?.BootcampNftImage,
      );
      const logoObjectURL = URL.createObjectURL(nftData.data as Blob);

      //@ts-ignore
      setDate(data?.data?.BootcampStartDate);
      setLogoImage(objectURL);
      setNFTLogoImage(logoObjectURL);
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await obtainCIDdata(props.uri);
      } catch (error) {
        console.error("Error loading bootcamp data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wallet, props.uri]);

  if (isLoading) {
    return (
      <div className="relative rounded-2xl mx-auto overflow-hidden flex items-center justify-center min-h-[300px] bg-white">
        <LoadingSpinner size="md" colorVariant="primary" />
      </div>
    );
  }

  return (
    <div
      onClick={() => handleActionClick(props.action)}
      className={`relative ${`h-[${props.height}] w-[${props.width}]`} rounded-2xl mx-auto overflow-hidden cursor-pointer`}
    >
      {/* Background Image */}
      <Image
        src={logoImagesource}
        alt="eventimage"
        className="object-cover w-full h-full"
        layout="fill"
      />

      {/* Action Button */}
      <Button
        onClick={() => handleActionClick(props.action)}
        disabled={isNavigating}
        className="hidden absolute top-3 right-6 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[50px] items-center lg:w-[90px] text-sm"
      >
        {isNavigating ? (
          <LoadingSpinner variant="button" size="sm" />
        ) : (
          <div>{props.action}</div>
        )}
      </Button>

      {/* Bottom Section with Gradient */}
      <div className="absolute bottom-0 z-20 w-full h-[150px] flex items-center justify-center text-center bg-carousell-gradient rounded-b-2xl">
        <div className="flex mt-20 space-x-3">
          {/* Logo */}
          <div className="rounded-full h-[41px] w-[41px] overflow-hidden">
            <Image
              src={NFTImagesource}
              alt="logo"
              className="object-cover"
              height={41}
              width={41}
            />
          </div>
          {/* Name and Time */}
          <div>
            <h1 className="text-[#FFFFFF] text-[18px] font-bold leading-[22px]">
              {props.name}
            </h1>
            <h1 className="text-[#FFFFFF] text-[14px] font-medium leading-[13px]">
              {date}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carosellcard;
