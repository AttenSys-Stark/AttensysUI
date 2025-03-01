// ExploreResult.tsx
import React, { useState } from "react";
import { Button, Input } from "@headlessui/react";
import Image from "next/image";
import filter from "@/assets/filter.png";
import { RiArrowDropDownLine } from "react-icons/ri";
import { eventsData, gridsData } from "@/constants/data";
import ResultGrid from "./ResultGrid";
import { handleSubmit } from "@/utils/helpers";
import { useRouter } from "next/navigation";

type Params = {
  address?: string;
};

const ExploreResult: React.FC<{ params: Params }> = ({ params }) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { address } = params;
  const itemsPerPage = 10;

  const totalPages = Math.ceil(eventsData.length / itemsPerPage);

  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    if (currentPage > 2) pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  const handleChange = (event: { target: { value: any } }) => {
    setSearchValue(event.target.value);
  };

  const shortenAddress = (address: any) => {
    return address.slice(0, 10) + "..." + address.slice(-10);
  };

  return (
    <div className="bg-[#F5F7FA] w-full">
      <div className="mx-4 lg:mx-36 py-5">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-[#e0e0e0] pb-4">
          <div className="space-y-2 mb-4 lg:mb-0">
            <h1 className="text-[18px] font-medium leading-[22px] text-[#333333]">
              Explorer Result
            </h1>
            <p className="text-[15px] font-medium leading-[18px] text-[#817676]">
              Key : Address{" "}
              <span className="text-[#9b51e0]">
                ({shortenAddress(address)})
              </span>
            </p>
          </div>

          <div className="w-full lg:w-[50%] relative">
            <form onSubmit={(e) => handleSubmit(e, searchValue, router)}>
              <div className="w-full h-[50px] rounded-xl bg-[#FFFFFF] px-6 flex items-center justify-between">
                <div className="w-full lg:w-[70%] relative">
                  <Input
                    name="search by address"
                    type="text"
                    placeholder="Search an address | organization | Course"
                    value={searchValue}
                    onChange={handleChange}
                    className="w-full h-[50px] p-2 pl-10 rounded-xl text-[15px] focus:outline-none font-medium text-[#817676] placeholder-[#817676]"
                  />
                  {!searchValue && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-[25px] w-[25px] text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  )}
                </div>

                <div className="hidden lg:flex h-[42px] w-[20%] rounded-xl items-center justify-center bg-[#4A90E21F] border-[1px] border-[#6B6D6E] space-x-1">
                  <h1 className="text-[#2D3A4B] text-[14px] leading-[21px] font-medium">
                    All Filters
                  </h1>
                  <RiArrowDropDownLine className="h-[20px] w-[20px] text-[#2D3A4B]" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap lg:flex-nowrap gap-3 my-5">
          {["Filter", "Events", "Organization", "Certification", "Courses"].map(
            (category, index) => (
              <Button
                key={index}
                className="hidden lg:flex rounded-lg bg-[#4A90E21F] py-2 px-4 h-[42px] items-center w-[90px] text-sm text-[#2d3a4b]"
              >
                {category === "Filter" && (
                  <Image src={filter} alt="filter" className="mr-2" />
                )}
                <div className="text-[11px]">{category}</div>
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Grid Results */}
      <div className="mx-4 lg:mx-36">
        {gridsData.map((item, i) => (
          <ResultGrid
            key={i}
            item={item}
            eventsData={item.eventsData}
            generatePageNumbers={generatePageNumbers}
            goToPage={goToPage}
            currentPage={currentPage}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreResult;
