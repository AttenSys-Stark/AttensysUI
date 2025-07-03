import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { provider } from "@/constants";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { createMeeting } from "@/state/connectedWalletStarknetkitNext";
import { Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { RiEditFill } from "react-icons/ri";
import { Contract } from "starknet";

const Tophero = () => {
  const [meetingCreation, setMeetingCreation] = useAtom(createMeeting);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [bootcampInfo, setBootcampInfo] = useState([]);
  const [bootcampname, setBootcampName] = useState("");
  const [organizer, setOrganizers] = useState("");
  const [capacity, setCapacity] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");
  const [Imagesource, setImageSource] = useState<string | StaticImport>("");
  const [bootcampDate, setDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const handleCreateMeeting = () => {
    setMeetingCreation(true);
  };

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getBootcampInfo = async () => {
    const bootcampInfo = await orgContract?.get_bootcamp_info(org, id);
    console.info("bootcamp fetch", bootcampInfo);
    obtainCIDdata(bootcampInfo?.bootcamp_ipfs_uri);
    setBootcampInfo(bootcampInfo);
    setBootcampName(bootcampInfo?.bootcamp_name);
    setOrganizers(bootcampInfo?.org_name);
    setCapacity(Number(bootcampInfo?.number_of_students));
  };

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

      let formatedDate = formatBootcampDates(data?.data);
      //@ts-ignore
      setDate(formatedDate);
      setImageSource(objectURL);
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  function formatBootcampDates(data: any) {
    const startDate = new Date(data.BootcampStartDate);
    const endDate = new Date(data.BootEndDate);

    const formatDayWithSuffix = (date: any) => {
      const day = date.getDate();
      const suffix = ["th", "st", "nd", "rd"][
        day % 10 > 3 || (day >= 11 && day <= 13) ? 0 : day % 10
      ];
      return `${day}${suffix}`;
    };

    const startDay = formatDayWithSuffix(startDate);
    const endDay = formatDayWithSuffix(endDate);
    const month = startDate.toLocaleString("en-US", { month: "short" });
    const year = startDate.getFullYear();

    return `${startDay} - ${endDay} ${month}, ${year}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getBootcampInfo();
      } catch (error) {
        console.error("Error loading bootcamp data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wallet]);

  if (isLoading) {
    return (
      <div className="lg:h-[261px] w-full lg:w-[90%] lg:mx-auto flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <div className="lg:h-[261px] w-full lg:w-[90%]  lg:mx-auto flex flex-col lg:flex-row justify-between lg:items-center rounded-xl">
      <div className="lg:hidden flex px-[22px] gap-1 mt-10">
        <h3 className="text-[#5801A9] font-black">Edit bootcamp page</h3>
        <RiEditFill className="text-[#5801A9] h-[21px] w-[21px]" />
      </div>
      <div className="h-full w-full lg:w-[20%] rounded-xl mt-6 px-[22px] sm:px-0   mb-11 lg:mb-0 lg:mt-0 border-[1px] border-[#B8B9BA]">
        <Image
          src={Imagesource}
          alt="flier"
          className="h-full w-full object-cover rounded-xl"
          width={500}
          height={500}
        />
      </div>

      <div
        className={`bg-[url('/dashbordbg.svg')] h-full w-full lg:w-[78%] rounded-xl bg-cover p-6 lg:px-10 space-y-6 lg:space-y-20 flex flex-col justify-center`}
      >
        <div className="flex flex-col lg:flex-row space-y-6 justify-between">
          <div className="space-y-1">
            <h1 className="text-[#FFFFFF] text-[16px] leading-[22px] font-medium">
              Bootcamp ID : {id}
            </h1>
            <h1 className="text-[#FFFFFF] text-[18px] leading-[25px] font-black">
              {bootcampname}
            </h1>
            <h1 className="text-[#FFFFFF] text-[15px] leading-[22px] font-black">
              {" "}
              Organizer- <span className="font-light">@ {organizer}</span>
            </h1>
          </div>
          <Button
            onClick={handleCreateMeeting}
            className="h-[49px] w-[206px] flex items-center space-x-2 justify-center bg-[#FFFFFF] rounded-xl"
          >
            <FiLink className="text-[#9747FF] h-[17px] w-[17px]" />
            <h1 className="text-[#2D3A4B] text-[14px] leading-[19px] font-bold">
              Create Meeting
            </h1>
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-[#FFFFFF] text-[16px] leading-[22px] font-medium">
              Schedule
            </h1>
            <div className="h-[7px] w-[7px] rounded-full bg-[#DC1D16]"></div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-1 items-center">
              <LuCalendarDays className="text-[#FFFFFF] h-[21px] w-[19px]" />
              <h1 className="text-[#FFFFFF] text-[16px] leading-[22px] font-medium">
                {bootcampDate}
              </h1>
            </div>

            <div className="hidden lg:flex space-x-1 items-center">
              <h1 className="text-[#FFFFFF] text-[17px] leading-[25px] font-black">
                Edit bootcamp page
              </h1>
              <RiEditFill className="text-[#FFFFFF] h-[21px] w-[21px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tophero;
