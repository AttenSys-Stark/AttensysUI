import React, { useState } from "react";
import { Description, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import AlleventCard from "./AlleventCard";
import { allEventData } from "@/constants/data";
import { useRouter } from "next/navigation";
import { EventData } from "./DiscoverLanding";
import Orange from "@/assets/Orange.svg";
import { FormatDateFromUnix } from "@/utils/formatAddress";

const Allevents = ({ events }: { events: EventData[] }) => {
  const [visibleEvents, setVisibleEvents] = useState(8); // Number of events to show initially
  const router = useRouter();

  const handleSeeMore = () => {
    setVisibleEvents((prev) => prev + 8); // Load more events
  };
  const handleEventClick = (prop: EventData) => {
    router.push(`/Eventpage/${prop.event_name}`);
  };
  return (
    <div className="h-[1300px] sm:bg-[#f5f8fa] w-full flex items-center">
      <div className="w-[95%] sm:w-[80%] h-[90%] mx-auto space-y-6 overflow-y-scroll scrollbar-hide">
        <div className="flex space-x-4">
          <div className="border-[0.81px] border-[#2D3A4B] w-[140px] h-[48px] rounded-2xl flex items-center justify-center">
            <h1 className="text-[#2D3A4B] text-[16px] font-bold leading-[31px]">
              All Event
            </h1>
          </div>

          <div className="border-[0.81px] border-[#2D3A4B] w-[140px] h-[48px] rounded-2xl flex items-center justify-center">
            <h1 className="text-[#2D3A4B] text-[16px] font-bold leading-[31px]">
              Price
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap lg:grid lg:grid-cols-2 gap-7">
          {events.slice(0, visibleEvents).map((data, index) => {
            return (
              <AlleventCard
                onClick={() => handleEventClick(data)}
                key={index}
                name={data.event_name}
                hall={"Shoprite Ikeja City Mall"} // hardcoded hall
                city={"Lagos"} //hardcoded city
                date={FormatDateFromUnix(data.time.start_time).date}
                time={
                  FormatDateFromUnix(data.time.start_time).time +
                  " - " +
                  FormatDateFromUnix(data.time.end_time).time
                }
                fee={"10"} // hardcoded fee
                image={Orange}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-center w-full">
          <h1
            onClick={handleSeeMore}
            className="text-[#2D3A4B] flex items-center justify-center text-[16px] font-bold leading-[31px] border-[0.81px] border-[#2D3A4B] w-[140px] h-[48px] rounded-2xl cursor-pointer"
          >
            See more <span className="text-[10px] ml-3">▼</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Allevents;
