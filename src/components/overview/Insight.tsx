import cross from "@/assets/cross.svg";
import del from "@/assets/delete.svg";
import drop from "@/assets/drop.svg";
import share from "@/assets/share.svg";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { provider } from "@/constants";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { useFetchCID } from "@/hooks/useFetchCID";
import { connectorAtom } from "@/state/connectedWalletStarknetkitNext";
import { FormatDateFromUnix } from "@/utils/formatAddress";
import { Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import ChartData from "./ChartData";
import Emailinput from "./Emailinput";

const Insight = (props: any) => {
  const [emailList, setEmailList] = useState<string[]>([]);
  const [connector] = useAtom(connectorAtom);
  const [isStartingReg, setIsStartingReg] = useState(false);
  const [isEndingReg, setIsEndingReg] = useState(false);
  const [attendees, setattendees] = useState(0);
  const [suspension, setsuspensions] = useState(false);
  const [canceled, setcanceled] = useState(false);
  const [regOpen, setregOpen] = useState(0);
  const [starttime, setstarttime] = useState(0n);
  const [startDate, setstartDate] = useState(0n);
  const [endDate, setendDate] = useState(0n);
  const [logoImagesource, setLogoImage] = useState<string | StaticImport>("");
  const {
    fetchCIDContent,
    getError,
    isLoading: isCIDFetchLoading,
  } = useFetchCID();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails);
  };

  const handleStartAndEndRegistration = async ({
    start,
    eventId = Number(id),
  }: {
    start: boolean;
    eventId?: number;
  }) => {
    const loadingState = start ? setIsStartingReg : setIsEndingReg;
    loadingState(true);

    try {
      if (!connectorDataAccount) {
        alert("Please make sure you are connected to a wallet");
        return;
      }

      const eventContract = new Contract(
        attensysEventAbi,
        attensysEventAddress,
        connectorDataAccount,
      );

      const startEndRegistration = eventContract.populate("start_end_reg", [
        start,
        eventId,
      ]);

      const result = await eventContract.start_end_reg(
        startEndRegistration.calldata,
      );

      await connectorDataAccount?.provider.waitForTransaction(
        result.transaction_hash,
      );
    } catch (error) {
      console.error("Registration state change failed:", error);
    } finally {
      loadingState(false);
    }
  };

  const getEventData = async () => {
    const eventContract = new Contract(
      attensysEventAbi,
      attensysEventAddress,
      provider,
    );
    const res = await eventContract.get_event_details(Number(id));
    console.log("insight overview", res);
    setattendees(Number(res?.registered_attendants));
    setsuspensions(res?.is_suspended);
    setcanceled(res?.canceled);
    setregOpen(Number(res?.time.registration_open));
    setstarttime(res?.time.start_time);
    setstartDate(res?.time.start_time);
    setendDate(res?.time.end_time);
    obtainCIDdata(res?.event_uri);
  };

  const obtainCIDdata = async (CID: string) => {
    try {
      //@ts-ignore
      const data = await fetchCIDContent(CID);
      console.log("fetched CID event details", data);
      //@ts-ignore
      const logoData: GetCIDResponse = await fetchCIDContent(
        //@ts-ignore
        data?.data?.eventDesign,
      );
      const objectURL = URL.createObjectURL(logoData.data as Blob);
      setLogoImage(objectURL);
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      throw error;
    }
  };

  useEffect(() => {
    getEventData();
  }, [connectorDataAccount]);

  return (
    <div className="h-auto pb-32">
      <div className="w-[90%] max-w-[992px] h-[100%] mx-auto">
        {logoImagesource ? (
          <div className="w-[196px] h-[184px] rounded-lg overflow-hidden relative">
            <Image
              src={logoImagesource}
              alt="story"
              objectFit="cover"
              layout="fill"
            />
          </div>
        ) : null}

        <h1 className="mt-4 text-[#ABADBA] text-[29.7px] font-bold leading-[68px]">
          {props.eventname}
        </h1>
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="lg:basis-7/12 md:basis-1/2 md:w-1/2 lg:w-auto">
              <div className="h-full flex flex-col gap-4 justify-between items-start">
                <h1 className="font-medium text-[16px] text-[#2D3A4B] leading-[18.15px]">
                  Event Registration
                </h1>
                <div className="w-full md:w-full bg-[#FFFFFF] h-[272px] rounded-lg">
                  <ChartData />
                </div>
              </div>
            </div>
            <div className="lg:basis-5/12 md:basis-1/2 md:w-1/2">
              <div className="flex flex-col gap-4 justify-between items-end md:flex-1 md:basis-1/3">
                <Button className="bg-[#2D3A4B91] text-[#FFFFFF] font-light text-[14px] rounded-lg h-[39px] w-[110px] items-center flex justify-center">
                  <Image src={drop} alt="drop" className="mr-2" />
                  All time
                </Button>

                <div className="w-full md:w-full h-[272px] bg-[#2D3A4B] rounded-lg shadow-sm">
                  <div className="flex justify-between px-14 pt-10 pb-6">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Total Registration
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        {attendees}
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Suspended
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        {suspension ? (
                          <span className="text-red-900">Yes</span>
                        ) : (
                          <span className="text-green-800">No</span>
                        )}
                      </h1>
                    </div>
                  </div>

                  <div className="flex justify-between px-14 pb-6">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Canceled
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        {canceled ? (
                          <span className="text-red-900">Yes</span>
                        ) : (
                          <span className="text-green-800">No</span>
                        )}
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Registration
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        {regOpen == 0 ? (
                          <span className="text-red-900">Closed</span>
                        ) : (
                          <span className="">Open</span>
                        )}
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between px-14 pb-4">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Event Date
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[12.8px] leading-[18.15px]">
                        {FormatDateFromUnix(starttime ?? 0n).date ??
                          "unavailable"}
                        ,{" "}
                        {FormatDateFromUnix(startDate).time ?? "unavailable AM"}{" "}
                        -{" "}
                        {FormatDateFromUnix(endDate ?? 0n).time ??
                          "unavailable AM"}
                      </h1>
                    </div>
                    <div className="space-y-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full gap-8 md:gap-0 p-8 bg-[#FFFFFF] rounded-lg mt-4 shadow-sm">
            <div>
              <h1 className="text-[#2D3A4B] text-[16px] font-medium leading-[18.15px]">
                Event Registration URL
              </h1>
              <div className="mt-5">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-4 relative h-[60px]">
                  <div className="w-full flex-1 flex items-center border-2 rounded-2xl h-full">
                    <span className="bg-transparent text-[#2D3A4B] font-medium px-1 md:px-5 items-center border-r-2 text-xs md:text-base border-gray-300 inline-flex h-full">
                      https://attensys.io
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-1 md:px-4 h-full text-sm md:text-base py-2 border-gray-300 focus:outline-none rounded-r-2xl focus:ring-2 focus:ring-[#9B51E0] w-[80%]"
                      placeholder="/event-registration-link"
                    />
                  </div>
                  <Button className="md:w-[130px] px-6 py-4 flex items-center justify-center bg-[#53545C45] text-[#333333] font-semibold text-[12px] rounded-lg h-[36px] md:absolute md:right-4">
                    Share Link
                    <Image src={share} alt="drop" className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h1 className="text-[#2D3A4B] text-[16px] font-medium leading-[18.15px]">
                Assigned Managers
              </h1>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-center">
                <div className="w-full md:w-[590px] h-[60px] border-[2px] overflow-x-auto whitespace-nowrap rounded-2xl mt-5">
                  <Emailinput onEmailsChange={handleEmailsChange} />
                </div>
                <div className="w-full flex justify-end md:w-auto">
                  <Button className="bg-[#4A90E21F] text-[#5801A9] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
                    <Image src={cross} alt="drop" className="mr-2" />
                    Assign manager
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full gap-4">
            <Button
              onClick={() =>
                !isStartingReg && handleStartAndEndRegistration({ start: true })
              }
              disabled={isStartingReg}
              className={`font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5 ${
                isStartingReg
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500"
              } text-white`}
            >
              {isStartingReg ? (
                <LoadingSpinner size="sm" colorVariant="white" />
              ) : (
                "Start Registration"
              )}
            </Button>

            <Button
              onClick={() =>
                !isEndingReg && handleStartAndEndRegistration({ start: false })
              }
              disabled={isEndingReg}
              className={`font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5 ${
                isEndingReg ? "bg-red-600 cursor-not-allowed" : "bg-red-700"
              } text-white`}
            >
              {isEndingReg ? (
                <LoadingSpinner size="sm" colorVariant="white" />
              ) : (
                "End Registration"
              )}
            </Button>
            <Button className="bg-[#E0515152] text-[#730404] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
              <Image src={del} alt="drop" className="mr-2" />
              Cancel Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insight;
