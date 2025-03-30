import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { provider } from "@/constants";
import { attensysOrgAbi } from "@/deployments/abi";
import { attensysOrgAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { registerModal } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegHourglass, FaTags } from "react-icons/fa";
import { IoPeopleSharp, IoTimeSharp } from "react-icons/io5";
import { Contract } from "starknet";
import Descriptionsupport from "./Descriptionsupport";
import Ongoingcarousell from "./Ongoingcarousell";
import RegisterModal from "./RegisterModal";
import Sponsors from "./Sponsors";

const RegisterLanding = (props: any) => {
  const [regModal, setRegModal] = useAtom(registerModal);
  const decodedName = decodeURIComponent(props.regname);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [bootcampDataInfo, setBootcampdataInfo] = useState([]);
  const [bootcampInfo, setBootcampInfo] = useState([]);
  const [bootcampname, setBootcampName] = useState("");
  const [organizer, setOrganizers] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [bootcampDate, setDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [Imagesource, setImageSource] = useState<string | StaticImport>("");
  const [Description, setBootcampDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const org = searchParams.get("org");

  // console.log("this is register landing ID", id);
  // console.log("this is registerlanding org", org);

  const handleExplore = () => {
    router.push("/Bootcamps");
  };
  const handleRegister = () => {
    setRegModal(true);
  };

  const orgContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  );

  const getAllBootcamps = async () => {
    const bootcamps_info = await orgContract?.get_all_bootcamps_on_platform();
    setBootcampdataInfo(bootcamps_info);
  };

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
      // Fetch main bootcamp data
      const bootcampData = await fetchCIDContent(CID);

      // Fetch logo data
      const logoData = await fetchCIDContent(bootcampData.data.BootcampLogo);

      const objectURL = URL.createObjectURL(logoData.data as Blob);

      // Fetch NFT image data
      const nftData = await fetchCIDContent(bootcampData.data.BootcampNftImage);

      // Update state with fetched data
      setBootcampDescription(bootcampData.data.BootcampDescription);
      const formatedDate = formatBootcampDates(bootcampData.data);
      setDate(formatedDate);
      setImageSource(objectURL);
    } catch (error) {
      console.error("Error obtaining IPFS content:", error);
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
        await Promise.all([getAllBootcamps(), getBootcampInfo()]);
      } catch (error) {
        console.error("Error loading bootcamp data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wallet, id, org]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center">
        <LoadingSpinner size="lg" colorVariant="primary" />
      </div>
    );
  }

  return (
    <>
      {regModal && (
        <RegisterModal
          status={regModal}
          org_info={org}
          id_info={id}
          bootcamp_name={decodedName}
        />
      )}
      <div className="bg-[#f4f7f9] w-full h-auto py-4">
        <div className="flex flex-wrap justify-start space-x-0 px-4 md:px-8 items-center text-md text-[#5801A9] font-medium">
          <div onClick={handleExplore} className="cursor-pointer">
            Explore Bootcamp
          </div>
          <div className="px-4">
            <div className="h-[18px] w-[1px] border-[1px] border-[#5801A9]"></div>
          </div>
          <div className="truncate">{decodedName}</div>
        </div>

        <div className="h-auto w-full py-4 px-4 lg:px-8 flex flex-col items-start justify-start space-y-8 space-x-0 md:flex-row md:space-x-6 md:space-y-0 md:justify-between md:items-stretch mt-8">
          <div className="h-auto w-full md:w-[50%] lg:w-[40%] rounded-lg border-[1px] border-[#B8B9BA]">
            <Image
              src={Imagesource}
              alt="flier"
              className="h-full w-full object-cover rounded-lg"
              width={500}
              height={300}
            />
          </div>
          <div className="w-full h-auto rounded-lg bg-[#FFFFFF] border-[1px] border-[#B8B9BA]">
            <div className="px-4 lg:px-8 py-6 flex flex-col space-y-4 space-x-0 sm:space-y-0 sm:space-x-4 sm:flex-row sm:justify-between h-auto sm:items-center border-b-[1px] border-b-[#B8B9BA]">
              <h1 className="text-[#5801A9] text-md lg:texl-lg font-semibold">
                {bootcampname}
              </h1>
              <div className="flex items-end justify-end ml-auto">
                <div
                  onClick={handleRegister}
                  className="flex items-center space-x-2 cursor-pointer bg-[#4A90E2] py-4 px-4 lg:px-8 rounded-lg"
                >
                  <FaTags className="h-[16px] w-[16px] text-[#FFFFFF]" />
                  <h1 className="text-sm lg:text-md text-[#FFFFFF] font-semibold">
                    Register Now
                  </h1>
                </div>
              </div>
            </div>
            <div className="px-4 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start mt-8 w-full">
              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <CiCalendarDate className="h-[20px] w-[20px]" />
                  <h1 className="text-xs text-[#2D3A4B] font-light">
                    Bootcamp Date{" "}
                  </h1>
                </div>
                <h1 className="text-sm text-[#2D3A4B] font-medium">
                  {bootcampDate}
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <CiCalendarDate className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Organizers
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#2D3A4B] font-medium">
                  {organizer}
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <IoTimeSharp className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Time
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#2D3A4B] font-medium">
                  9:00am daily
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <IoPeopleSharp className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Bootcamp capacity
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#5801A9] font-medium">
                  {capacity}/300
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <FaRegHourglass className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Registeration Deadline
                  </h1>
                </div>
                <h1 className="text-[32px] text-[#5801A9] leading-[48px] font-bold">
                  2:59:59
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <h1 className="text-[#2D3A4B] text-md font-semibold">
                  Certification requirements
                </h1>
                <div className="flex flex-wrap items-center">
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Sponsors />
        <Descriptionsupport bootcampDescription={Description} />

        <Ongoingcarousell allbootcampInfo={bootcampDataInfo} />
      </div>
    </>
  );
};

export default RegisterLanding;
