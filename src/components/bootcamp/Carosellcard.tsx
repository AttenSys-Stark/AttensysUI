import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GetCIDResponse } from "pinata";
import { useEffect, useState } from "react";

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
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const handleActionClick = async (arg: any) => {
    setIsNavigating(true);
    try {
      if (arg == "Register") {
        router.push(
          `/Register/${props.name}/?id=${Number(props.alldata.bootcamp_id)}&org=${props.alldata.address_of_org}`,
        );
      } else if (arg == "Finished") {
        router.push(
          `/Register/${props.name}/?id=${Number(props.alldata.bootcamp_id)}&org=${props.alldata.address_of_org}`,
        );
      } else if (arg == "Manage") {
        router.push(
          `/Mybootcamps/${props.name}/?id=${Number(props.alldata.bootcamp_id)}&org=${props.alldata.address_of_org}`,
        );
      }
    } finally {
      setIsNavigating(false);
    }
  };

  // console.log("ongoing data", props)

  const obtainCIDdata = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await fetchCIDContent(CID);
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
      <div className="absolute bottom-0 z-20 w-full h-[150px] flex  bg-carousell-gradient rounded-b-2xl px-6">
        <div className="flex mt-20 space-x-5">
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
