"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlExclamation } from "react-icons/sl";
import up from "@/assets/up.svg";
import down from "@/assets/down.svg";
import show_arrow from "@/assets/show_arrow.svg";
import { IoClose } from "react-icons/io5";

interface Events {
  type: string;
  eventName: string;
  status: string;
  certification: string;
  nftImg: string;
  date: string;
}

interface GridItem {
  name: string;
  subProp: string[];
  viewPartName: string;
  heading: string[];
  eventsData: Array<{
    type: string;
    eventName: string;
    status: string;
    certification: string;
    nftImg: string;
    date: string;
  }>;
}

interface ResultGridProps {
  address: string;
  item: GridItem;
  eventsData: Events[];
  generatePageNumbers: () => (string | number)[];
  goToPage: (page: any) => void;
  currentPage: number;
}

const shortenAddress = (address: any) => {
  return address.slice(0, 10) + "..." + address.slice(-10);
};

const ResultGrid: React.FC<ResultGridProps> = ({
  address,
  item,
  eventsData,
  generatePageNumbers,
  goToPage,
  currentPage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  const renderContent = (arg: string) => {
    const eventCount = item.eventsData.filter(
      (event) => event.type === "COURSE_TAKEN",
    ).length;
    const markedCount = item.eventsData.filter(
      (event) =>
        event.type === "COURSE_TAKEN" && event.status === "Course Complete",
    ).length;
    const unmarkedCount = item.eventsData.filter(
      (event) =>
        event.type === "COURSE_TAKEN" && event.status !== "Course Complete",
    ).length;
    const certCount = item.eventsData.filter(
      (event) => event.type === "CERT_CLAIMED",
    ).length;
    const completedCourses = item.eventsData.filter(
      (event) => event.status === "Course Complete",
    ).length;
    const ongoingCourses = item.eventsData.filter(
      (event) => event.status === "Course Taken",
    ).length;
    const createdCourses = item.eventsData.filter(
      (event) => event.type === "COURSE_CREATED",
    ).length;

    switch (arg) {
      case "Key":
        return (
          <p className="text-[12px] font-medium leading-[16px] text-[#817676]">
            Address{" "}
            <span className="text-[#5801A9] text-[10px]">
              {shortenAddress(address)}
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
            <span className="text-[#9B51E0]">{eventCount}</span> events
          </h1>
        );
      case "Marked attendance":
        return (
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">{markedCount}</span> marked
            </h1>
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">{unmarkedCount}</span> unmarked
            </h1>
          </div>
        );
      case "Certifications":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{certCount}</span> Certifications
          </h1>
        );
      case "Completed courses":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{completedCourses}</span> completed
          </h1>
        );
      case "Ongoing":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{ongoingCourses}</span> in progress
          </h1>
        );
      case "Created courses":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{createdCourses}</span> created
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
        <div className="row-span-2 bg-white rounded-lg mb-6 py-5 border border-[#b9b9ba]">
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

          <div className="h-[308px] w-full overflow-auto">
            {item.eventsData.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className="w-full h-[42px] border-b-2 border-black font-normal text-[#2d3a4b] leading-[19.79px]">
                        {item.heading.map((heading, index) => (
                          <th
                            key={index}
                            className={`py-3 px-6 border-b-2 border-[#b9b9ba] text-[12px] h-[42px] ${
                              index === 0
                                ? "text-left w-[40%]"
                                : "text-center w-[20%]"
                            }`}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.eventsData
                        .slice((currentPage - 1) * 6, currentPage * 6)
                        .map((data, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 h-[60px] border-b-2 border-[#b9b9ba]"
                          >
                            <td className="py-3 px-6 max-w-[200px] truncate h-[60px]">
                              <span className="text-[14px] text-[#333333]">
                                {data.eventName}
                              </span>
                            </td>
                            <td className="py-3 px-6 whitespace-nowrap h-[60px]">
                              <div
                                className={`inline-flex p-2 rounded-lg text-xs items-center justify-center ${
                                  data.status === "Course Complete"
                                    ? "bg-[#C4FFA2] text-[#115E2C]"
                                    : "bg-[#F6A61C2B] text-[#730404]"
                                }`}
                              >
                                {data.status}
                              </div>
                            </td>
                            <td className="py-3 px-6 whitespace-nowrap h-[60px]">
                              <div className="flex items-center justify-center h-full">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#5801A9]">
                                    {data.certification}
                                  </span>
                                  {data.nftImg && (
                                    <Image
                                      src={data.nftImg}
                                      alt="nftImg"
                                      width={24}
                                      height={24}
                                      className="object-contain cursor-pointer"
                                      onClick={() =>
                                        handleImageClick(data.nftImg)
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center whitespace-nowrap h-[60px]">
                              <span className="text-[14px] text-[#333333]">
                                {data.date}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {item.eventsData
                    .slice((currentPage - 1) * 6, currentPage * 6)
                    .map((data, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-[#b9b9ba]"
                      >
                        <div className="px-6 py-4 border-b border-[#b9b9ba]">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[14px] text-[#333333] font-medium pr-2">
                              {data.eventName}
                            </h3>
                            <div
                              className={`inline-flex p-2 rounded-lg text-xs items-center justify-center shrink-0 ${
                                data.status === "Course Complete"
                                  ? "bg-[#C4FFA2] text-[#115E2C]"
                                  : "bg-[#F6A61C2B] text-[#730404]"
                              }`}
                            >
                              {data.status}
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[#5801A9] text-sm">
                                {data.certification}
                              </span>
                              {data.nftImg && (
                                <Image
                                  src={data.nftImg}
                                  alt="nftImg"
                                  width={24}
                                  height={24}
                                  className="object-contain cursor-pointer"
                                  onClick={() => handleImageClick(data.nftImg)}
                                />
                              )}
                            </div>
                            <span className="text-[12px] text-[#333333]">
                              {data.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {item.eventsData.length > 6 && (
                  <div className="flex justify-center space-x-2 pb-4 pt-10">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-1.5 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
                    >
                      {"<"}
                    </button>
                    {generatePageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={index} className="px-2 text-base mt-2">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => goToPage(page as number)}
                          className={`px-4 py-1.5 rounded text-[14px] ${
                            currentPage === page
                              ? "bg-none text-[#000000] border-[#9B51E0] border-[1px]"
                              : "bg-none text-[#000000]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(item.eventsData.length / 6)
                      }
                      className="px-4 py-1.5 border-[#D0D5DD] border-[1px] text-sm rounded disabled:opacity-50"
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <h1 className="text-[15px] text-[#817676] font-medium leading-[18px]">
                  This address has no event data
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative max-w-[90%] max-h-[90%]">
            <button
              onClick={handleCloseOverlay}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={800}
              height={800}
              className="object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultGrid;
