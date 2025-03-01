import { Button, Input } from "@headlessui/react";
import React, { useState } from "react";
import scan from "@/assets/scan.svg";
import Image from "next/image";
import check from "@/assets/check.svg";
import { attendanceData } from "@/constants/data";
import AttendanceList from "./AttendanceList";
import EventQRCode from "../eventdetails/EventQRCode";

const Attendance = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // Calculate total pages
  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);

  // Get current page items
  const currentItems = attendanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;

    // Always show the first page
    if (currentPage > 2) pageNumbers.push(1);

    // Show ellipsis if there are pages between the first page and current page range
    if (currentPage > 3) pageNumbers.push("...");

    // Show the range of pages around the current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Show ellipsis if there are pages between the current range and the last page
    if (currentPage < totalPages - 2) pageNumbers.push("...");

    // Always show the last page
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  // Handle pagination controls
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="h-auto w-[90%] max-w-[992px] mx-auto pb-10">
      <div className="bg-[#FFFFFF] rounded-lg flex flex-wrap items-center md:py-4 md:divide-x md:divide-gray-400">
        {[
          { label: "Total scans", value: 39 },
          { label: "Confirmed scans", value: 31 },
          { label: "Error scans", value: 3 },
        ].map((item, index) => (
          <div key={index} className="w-1/2 p-6 text-center md:flex-1">
            <p className="text-[#2D3A4B] text-[16px] font-medium leading-[18px]">
              {item.label}
            </p>
            <h1 className="text-[#9B51E0] text-[29.7px] font-bold leading-[68.91px] opacity-40">
              {item.value}
            </h1>
          </div>
        ))}
      </div>

      <div className="mx-auto p-4 lg:p-16 bg-[#FFFFFF] mt-4 rounded-lg">
        <div className="relative">
          <div className="flex items-center justify-between h-12">
            <h1 className="text-[18px] lg:w-1/12 font-medium leading-[22px] text-[#333333]">
              Attendance
            </h1>
            <Button className="lg:flex rounded-lg justify-center bg-[#2D3A4B] py-2 px-4 lg:h-[42px] items-center lg:w-[140px] text-sm text-[#FFFFFF] data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
              <div className="text-[11px] items-center font-semibold">
                Confirm Attendee
              </div>
            </Button>
          </div>
          <div className="lg:absolute lg:left-[calc(100%/12*4)] lg:w-6/12 top-1 lg:w-[calc(100% - (100%/12 * 2) - 10px)]">
            <div className="relative">
              <Input
                name="search by address"
                type="text"
                placeholder="Search wallet address"
                value={searchValue}
                onChange={handleChange}
                className="w-full h-10 p-2 pl-8 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {!searchValue && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full mt-6 flex items-center justify-center">
          <div className="w-[235px] h-[224px] border-[3px] border-[#4A90E2] rounded-xl mx-auto flex justify-center items-center">
            {/* <Image src={scan} alt="scan" /> */}
            <EventQRCode eventId="sample-event" />
          </div>
        </div>
        <h1 className="mt-6 text-[18px] font-medium text-[#333333] leading-[22px] w-[92%] mx-auto">
          Scan Results
        </h1>
        <div className="mt-6 h-[350px] overflow-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="h-[56px] w-full text-[14px] bg-[#9B51E052] text-[#5801A9] leading-[19.79px]">
                <th className="w-[50px] px-4 rounded-tl-xl rounded-bl-xl">
                  <Image src={check} alt="ticket" />
                </th>
                <th className="font-light text-center ">Name</th>
                <th className="font-light text-center ">Address</th>
                <th className="font-light text-center ">Scan Status</th>
                <th className="font-light text-center ">Role</th>
                <th className="font-light text-center rounded-tr-xl rounded-br-xl">
                  Reg date
                </th>
              </tr>
            </thead>
            {currentItems.map((data, index) => {
              return (
                <AttendanceList
                  key={index}
                  name={data.name}
                  address={data.address}
                  role={data.role}
                  regdate={data.date}
                  checkstat={data.checkstat}
                />
              );
            })}
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
          >
            {"<"}
          </button>
          {generatePageNumbers().map((page, index) =>
            page == "..." ? (
              <span key={index} className="px-2 mt-2 text-base">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded text-[14px] ${currentPage == page ? "bg-none text-[#000000] border-[#F56630] border-[1px]" : "bg-none text-[#000000]"}`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border-[#D0D5DD] border-[1px] text-[20px] rounded disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
