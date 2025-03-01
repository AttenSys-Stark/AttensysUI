import React, { useState } from "react";
import story from "@/assets/story.svg";
import Image from "next/image";
import { Button } from "@headlessui/react";
import drop from "@/assets/drop.svg";
import Emailinput from "./Emailinput";
import cross from "@/assets/cross.svg";
import share from "@/assets/share.svg";
import del from "@/assets/delete.svg";
import ChartData from "./ChartData";
import { Contract } from "starknet";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { useAtom } from "jotai";
import { connectorAtom } from "@/state/connectedWalletStarknetkitNext";

const Insight = (props: any) => {
  const [emailList, setEmailList] = useState<string[]>([]);
  const [connector] = useAtom(connectorAtom);
  // const [loading, setLoading] = useState(false);

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails);
  };

  const handleStartAndEndRegistration = async ({
    start,
    eventId = 2, //hardcoded event_identifier value of 2
  }: {
    start: boolean;
    eventId?: number;
  }) => {
    if (!connectorDataAccount) {
      alert("Please make sure you are connected to a wallet");
      return;
    }

    // setLoading(true);
    const eventContract = new Contract(
      attensysEventAbi,
      attensysEventAddress,
      connectorDataAccount,
    );
    //This is calling the start_end_reg function from the contract using an hardcoded event_identifier value of 2 as set in the function parameters above
    const startEndRegistrationCall = eventContract.populate("start_end_reg", [
      start,
      eventId,
    ]);

    const result = await eventContract.start_end_reg(
      startEndRegistrationCall.calldata,
    );
    //@ts-ignore
    connectorDataAccount?.provider
      .waitForTransaction(result.transaction_hash)
      .then(() => {
        console.log("Success");
      })
      .catch((e: any) => {
        console.log("Error: ", e);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  return (
    <div className="h-auto pb-32">
      <div className="w-[90%] max-w-[992px] h-[100%] mx-auto">
        <div className="w-[196px] h-[184px] rounded-lg overflow-hidden relative">
          <Image src={story} alt="story" objectFit="cover" layout="fill" />
        </div>
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
                <Button className="bg-[#2D3A4B91] text-[#FFFFFF] font-light text-[14px] rounded-lg h-[39px] w-[155px] items-center flex justify-center">
                  <Image src={drop} alt="drop" className="mr-2" />
                  Past Week
                </Button>

                <div className="w-full md:w-full h-[272px] bg-[#2D3A4B] rounded-lg shadow-sm">
                  <div className="flex justify-between px-14 pt-10 pb-6">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Total Registration
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        36
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Highest Daily Reg
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        Saturday
                      </h1>
                    </div>
                  </div>

                  <div className="flex justify-between px-14 pb-6">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Event Managers/hosts
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        5
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Approvals Granted
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        31
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between px-14 pb-4">
                    <div className="space-y-3">
                      <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                        Disapprovals
                      </h1>
                      <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                        3
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
              onClick={() => handleStartAndEndRegistration({ start: true })}
              className="bg-green-500 text-[#FFFFFF] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5"
            >
              {/* <Image src={del} alt="drop" className="mr-2" /> */}
              Start Registeration
            </Button>
            <Button
              onClick={() => handleStartAndEndRegistration({ start: false })}
              className="bg-red-700 text-white font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5"
            >
              {/* <Image src={del} alt="drop" className="mr-2" /> */}
              End Registeration
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
