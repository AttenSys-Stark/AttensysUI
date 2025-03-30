"use client";

import React from "react";
import Image from "next/image";
import { SlExclamation } from "react-icons/sl";
import up from "@/assets/up.svg";
import down from "@/assets/down.svg";
import show_arrow from "@/assets/show_arrow.svg";

interface Events {
  eventName: string;
  status: string;
  certification: string;
  nftImg: string;
  date: string;
}

// First define the interfaces for the grid item structure
interface GridItem {
  name: string;
  subProp: string[];
  viewPartName: string;
  heading: string[];
  eventsData: Array<{
    eventName: string;
    status: string;
    certification: string;
    nftImg: string;
    date: string;
  }>;
}

interface ResultGridProps {
  item: GridItem;
  eventsData: Events[];
  generatePageNumbers: () => (string | number)[];
  goToPage: (page: any) => void;
  currentPage: number;
}

const ResultGrid: React.FC<ResultGridProps> = ({
  item,
  eventsData,
  generatePageNumbers,
  goToPage,
  currentPage,
}) => {
  const renderContent = (arg: string) => {
    switch (arg) {
      case "Key":
        return (
          <p className="text-[12px] font-medium leading-[16px] text-[#817676]">
            Address{" "}
            <span className="text-[#5801A9] text-[10px]">
              (0x5c956e61...de5232dc11)
            </span>
          </p>
        );
      case "Status":
        return (
          <div className="h-[30px] w-auto px-4 bg-[#C4FFA2] rounded-xl flex items-center justify-center">
            <h1 className="text-[#115E2C] font-light text-[12px] leading-[19px]">
              Verified
            </h1>
          </div>
        );
      case "Registered events":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">15</span> events
          </h1>
        );
      case "Marked attendance":
        return (
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">14</span> marked
            </h1>
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">1</span> unmarked
            </h1>
          </div>
        );
      case "Certifications":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">14</span> Certifications
          </h1>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
        {/* Left Column - Overview Section */}
        <div className="row-span-2 bg-white rounded-lg mb-6 py-5 border border-[#b9b9ba]">
          <div className="border-b-2 border-[#b9b9ba]">
            <div className="flex gap-2 w-auto rounded-xl mx-12 items-center border-[1px] border-[#6B6D6E] p-3 mb-3">
              <h1>{item.name} Overview</h1>
            </div>
          </div>

          <div className="mx-12 mt-3">
            {item.subProp.map((prop, i) => (
              <div key={i} className="flex space-x-4 items-center py-2">
                <div className="flex items-center space-x-3 my-2 w-[250px]">
                  <SlExclamation className="text-[#2D3A4B] h-[12px] w-[12px]" />
                  <p className="text-[14px] font-medium text-[#333333] leading-[22px]">
                    {prop}:
                  </p>
                </div>
                {renderContent(prop)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Events Table */}
        <div className="row-span-3  text-xs">
          {/* Desktop View */}
          {/* <div className="hidden lg:block bg-white rounded-lg mb-6 border border-[#b9b9ba]">
            <div className="border-b-2 border-[#b9b9ba]">
              <div className="flex justify-between items-center px-8 pt-5 pb-3">
                <div className="border-[1px] border-[#6B6D6E] p-3 rounded-xl">
                  <h1 className="text-sm">{item.viewPartName}</h1>
                </div>
              </div>
            </div>

            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#b9b9ba]">
                    {item.heading.map((header, i) => (
                      <th
                        key={i}
                        className="text-left py-3 px-4 text-sm font-medium text-[#2d3a4b]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eventsData.map((event, index) => (
                    <tr key={index} className="border-b border-[#b9b9ba]">
                      <td className="py-3 px-4">{event.eventName}</td>
                      <td className="py-3 px-4">
                        <div
                          className={`inline-block px-3 py-1 rounded-lg text-xs ${
                            event.status === "Course Complete"
                              ? "bg-[#C4FFA2] text-[#115E2C]"
                              : "bg-[#F6A61C2B] text-[#730404]"
                          }`}
                        >
                          {event.status}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#5801A9]">
                        {event.certification}
                      </td>
                      <td className="py-3 px-4">{event.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {eventsData.length === 0 && (
                <div className="text-center py-8 text-[#817676]">
                  This address has no event data
                </div>
              )}
            </div>
          </div> */}
          <div className="hidden lg:block">
            {/* Events Table Section */}
            <div className="mx-auto h-auto bg-[#FFFFFF] rounded-lg mb-24 border border-[#b9b9ba] ">
              <div className="border-b-2 border-[#b9b9ba]">
                <div className="flex justify-between items-center px-8 pt-5">
                  <div className="border-[1px] border-[#6B6D6E] p-3 mb-3 rounded-xl">
                    <h1 className="text-[14px]">{item.viewPartName}</h1>
                  </div>
                  {item.eventsData.length === 0 ? (
                    <Image src={up} alt="up" />
                  ) : (
                    <Image src={down} alt="down" />
                  )}
                </div>
              </div>

              <div
                className={`${item.eventsData.length > 0 ? "" : "h-[308px]"} w-full overflow-auto`}
              >
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="w-full h-[42px] border-b-2 border-black font-normal text-[#2d3a4b] leading-[19.79px] rounded">
                      {item.heading.map((item, i) => (
                        <td
                          key={i}
                          className="py-3 pl-3 flex-none border-b-2 border-[#b9b9ba] text-[12px]"
                        >
                          {item}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  {item.eventsData.length > 0 &&
                    item.eventsData.map((data, index) => (
                      <tbody key={index}>
                        <tr>
                          <td className="py-3 pl-10 border-b-2 border-[#b9b9ba] flex-none">
                            {data.eventName}
                          </td>
                          <td className="p-3 mb-3 border-b-2 border-[#b9b9ba] font-normal text-xs leading-[19.79px]">
                            <div
                              className={`flex p-2 rounded-lg text-xs items-center justify-around flex-none ${
                                data.status === "Course Complete"
                                  ? "bg-[#C4FFA2] text-[#115E2C]"
                                  : "bg-[#F6A61C2B] text-[#8#730404]"
                              }`}
                            >
                              {data.status}
                            </div>
                          </td>
                          <td className="p-3 border-b-2 border-[#b9b9ba] text-xs font-normal text-[#5801A9] leading-[19.79px]">
                            <h1 className="h-[30px] flex justify-center items-center text-[#5801A9] text-center">
                              {data.certification}
                            </h1>
                          </td>
                          <td className="p-3 border-b-2 border-[#b9b9ba] text-xs py-2 font-normal text-[#5801A9] leading-[19.79px]">
                            {data.date}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                </table>
                {item.eventsData.length === 0 && (
                  <div className="h-[70%] w-full flex items-center justify-center">
                    <h1 className="text-[15px] text-[#817676] font-medium leading-[18px]">
                      This address has no event data
                    </h1>
                  </div>
                )}
              </div>
              {/* Pagination Controls */}
              {item.eventsData.length == 0 ? null : item.eventsData.length >
                6 ? (
                <div className="flex justify-center space-x-2 my-4">
                  <button
                    // onClick={goToPreviousPage}
                    // disabled={currentPage === 1}
                    className="px-4 py-2 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
                  >
                    {"<"}
                  </button>
                  {generatePageNumbers().map((page, index) =>
                    page == "..." ? (
                      <span key={index} className="px-2 text-base mt-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded text-[14px] ${
                          currentPage == page
                            ? "bg-none text-[#000000] border-[#F56630] border-[1px]"
                            : "bg-none text-[#000000]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    // onClick={goToNextPage}
                    // disabled={currentPage === totalPages}
                    className="px-4 py-2 border-[#D0D5DD] border-[1px] text-[20px] rounded disabled:opacity-50"
                  >
                    {">"}
                  </button>
                </div>
              ) : (
                <div className="flex justify-center my-4">
                  <p
                    // onClick={goToPreviousPage}
                    // disabled={currentPage === 1}
                    className="px-2 py-2 bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] inline-block text-transparent bg-clip-text"
                  >
                    Show more
                  </p>
                  <Image src={show_arrow} alt="show_arrow" />
                </div>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {eventsData.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-[#b9b9ba]"
              >
                <h3 className="font-medium mb-2">{event.eventName}</h3>
                <div className="space-y-2">
                  <div
                    className={`inline-block px-3 py-1 rounded-lg text-xs ${
                      event.status === "Course Complete"
                        ? "bg-[#C4FFA2] text-[#115E2C]"
                        : "bg-[#F6A61C2B] text-[#730404]"
                    }`}
                  >
                    {event.status}
                  </div>
                  <p className="text-[#5801A9] text-sm">
                    {event.certification}
                  </p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
            {eventsData.length === 0 && (
              <div className="text-center py-8 text-[#817676]">
                This address has no event data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultGrid;
