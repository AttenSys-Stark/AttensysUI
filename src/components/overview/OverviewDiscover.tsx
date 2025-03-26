import React from "react";
import Image from "next/image";
import moon from "@/assets/moon.svg";
import upcoming from "@/assets/upcoming.svg";
import top from "@/assets/top.svg";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import edit from "@/assets/edit.svg";
import goto from "@/assets/goto.svg";
import { useSearchParams } from "next/navigation";

const OverviewDiscover = (props: any) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const handlerouting = () => {
    router.push("/Events/createdevent");
  };
  const handleEventPage = () => {
    router.push(`/Eventpage/${props.eventsname}/?id=${id}`);
  };

  const handleDiscover = () => {
    router.push("/Discoverevent");
  };

  return (
    <div className="h-[120px] pt-3 clg:h-[80px] lg:h-[70px] lclg:h-[60px] flex flex-col lg:flex-row justify-around w-[90%] mx-auto items-start lg:items-center lg:pt-10">
      <div className="lg:w-full sm:w[90%]">
        <div className="flex flex-wrap w-full lg:space-x-4 space-x-4 items-center lg:px-4">
          <div
            onClick={handleDiscover}
            className="flex space-x-3 items-center cursor-pointer"
          >
            <Image src={moon} alt="moon" />
            <h1 className="text-[14px] lg:text-[16px] font-medium text-[#333333]">
              Discover
            </h1>
          </div>
          <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
          <div
            className="flex space-x-3 items-center cursor-pointer"
            onClick={handlerouting}
          >
            <Image src={upcoming} alt="moon" />
            <h1 className="text-[14px] lg:text-[16px] font-medium text-[#333333]">
              My Events
            </h1>
          </div>
          <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>
          <div className="flex space-x-3 items-center cursor-pointer">
            <h1 className="text-[14px] lg:text-[16px] font-medium text-[#333333]">
              {props.eventsname}
            </h1>
          </div>
        </div>
      </div>

      <div className="space-x-3 md:space-x-6 flex items-center">
        <Button className="flex rounded-lg bg-[#4A90E21F] hover:bg-sky-500 active:bg-sky-700 py-2 px-4 lg:h-[42px] items-center lg:w-[180px] text-sm text-[#5801A9] lg:items-center lg:justify-center">
          <div className="space-x-4 items-center font-semibold text-[16px]">
            <Image src={edit} alt="ticket" className="mr-2" />
          </div>
          <div className="text-[14px] font-medium">Edit Event</div>
        </Button>
        <Button
          onClick={handleEventPage}
          className="justify-center flex rounded-lg bg-[#2D3A4B] py-2 px-4 lg:h-[42x] items-center lg:w-[180px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
        >
          <div className="text-[14px] font-medium">Event Page</div>
          <div className="flex space-x-4 items-center font-semibold text-[16px]">
            <Image src={goto} alt="ticket" className="" />
          </div>
        </Button>
        <Image src={top} alt="moon" className="hidden md:block" />
      </div>
    </div>
  );
};

export default OverviewDiscover;
