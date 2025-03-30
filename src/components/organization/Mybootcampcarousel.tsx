import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { GetCIDResponse } from "pinata";
import { useEffect, useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";

// interface CarousellCardProp {
//   name : string,
//   time : string,
//   flier: any,
//   logo : any,
//   action : string,
//   height : string,
//   width: string,
//   uri : string,
//   onClick?: () => void;
// }

const Mybootcampcarousel = (props: any) => {
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");
  const [NFTImagesource, setNFTLogoImage] = useState<string | StaticImport>("");
  const [date, setDate] = useState<string | null>(null);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const obtainCIDdata = async (CID: string) => {
    try {
      const data = await fetchCIDContent(CID);
      //@ts-ignore
      console.info("bootcamp uri here", data?.data);
      //@ts-ignore
      const logoData: GetCIDResponse = await fetchCIDContent(
        //@ts-ignore
        data?.data?.BootcampLogo,
      );
      const objectURL = URL.createObjectURL(logoData.data as Blob);

      //@ts-ignore
      const nftData: GetCIDResponse = await fetchCIDContent(
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
    obtainCIDdata(props.uri);
  }, [wallet]);

  return (
    <>
      <div
        className={`relative ${`h-[${props.height}] w-[${props.width}]`} rounded-2xl mx-auto cursor-pointer`}
        onClick={props.onClick}
      >
        <div className="h-[200px] w-full rounded-2xl">
          <Image
            src={logoImagesource}
            alt="eventimage"
            className="object-cover w-full h-full rounded-2xl"
            layout="fill"
          />
        </div>
        <Button className="hidden absolute top-3 right-6 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[23px] items-center lg:w-[50px] text-sm data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
          <div className="text-[7px]">{props.action}</div>
        </Button>
        <div className="absolute bottom-0 z-20 flex px-6 w-full pb-4 bg-carousell-gradient">
          <div className="flex mt-20 space-x-3">
            <div className="rounded-full h-[24px] w-[24px]">
              <Image
                src={NFTImagesource}
                alt="logo"
                className="object-cover w-full h-full rounded-full"
                height={24}
                width={24}
              />
            </div>
            <div>
              <h1 className="text-[#FFFFFF] text-[10px] font-bold leading-[22px]">
                {props.name}
              </h1>
              <h1 className="text-[#FFFFFF] text-[10px] font-medium leading-[8px]">
                {date}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto mt-3 flex items-center space-x-2">
        <IoSettingsSharp className="text-[#2D3A4B]" />
        <h1 className="text-[14px] leading-[22px] font-medium text-[#333333]">
          Manage bootcamp
        </h1>
      </div>
    </>
  );
};

export default Mybootcampcarousel;
