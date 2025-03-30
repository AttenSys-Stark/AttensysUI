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

const MobileBootcampCard = (props: any) => {
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
      const data = await CID;
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
        className={`relative h-[${props.height}] w-[${props.width}] rounded-2xl mx-0 md:mx-auto overflow-hidden cursor-pointer`}
        onClick={props.onClick}
      >
        <div className="h-[200px] w-full rounded-2xl">
          <Image
            src={logoImagesource}
            alt="eventimage"
            className="object-cover w-full h-full"
            layout="fill"
          />
        </div>

        <Button className="absolute top-3 right-4 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[50px] items-center lg:w-[90px] text-[12px] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
          {props.action}
        </Button>

        <div className="absolute bottom-0 z-20 flex items-center justify-center w-full pb-4 text-center bg-carousell-gradient">
          <div className="flex mt-20 space-x-3">
            <div className="rounded-full h-[41px] w-[41px] overflow-hidden">
              <Image
                src={NFTImagesource}
                alt="logo"
                className="object-cover"
                height={41}
                width={41}
              />
            </div>
            <div>
              <h1 className="text-[#FFFFFF] text-[8px] font-bold">
                {props.name}
              </h1>
              <h1 className="text-[#FFFFFF] text-[6px] font-medium">{date}</h1>
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

export default MobileBootcampCard;
