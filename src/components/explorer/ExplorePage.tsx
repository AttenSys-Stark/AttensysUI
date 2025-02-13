import React, { useState, useEffect } from "react";
import { Button, Input } from "@headlessui/react";
import Image from "next/image";
import filter from "@/assets/filter.png";
import { explorerData, mockkdata } from "@/constants/data";
import TableList from "./TableList";
import { useRouter } from "next/navigation";
import { handleSubmit } from "@/utils/helpers";
import { RiArrowDropDownLine } from "react-icons/ri";

const ExplorePage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxVisiblePages, setMaxVisiblePages] = useState(10);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setMaxVisiblePages(window.innerWidth < 640 ? 3 : 10);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(explorerData.length / itemsPerPage);
  const currentItems = explorerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  return (
    <div className="mx-4 md:mx-8 lg:mx-24 pb-10">
      {/* Hero Section */}
      <div className="bg-[url('/explorer_bg.svg')] relative text-white overflow-hidden px-4 md:px-16 lg:px-32 py-10 md:py-20 from-orange-400 via-red-500 to-pink-500 h-auto md:h-64 shadow-[inset_15px_25px_100px_rgba(0,0,0,1)]">
        <h1 className="text-xl md:text-2xl font-bold">The Attensys Explorer</h1>

        {/* Search Form */}
        <div className="relative w-full md:w-[80%] my-5">
          <form onSubmit={(e) => handleSubmit(e, searchValue, router)}>
            <div className="h-[61px] sm:w-full md:w-[627px] bg-white rounded-xl md:px-6 flex items-center justify-between">
              <div className="w-full md:w-[75%] relative">
                <Input
                  name="search by address"
                  type="text"
                  placeholder="Search an address | organization | Course"
                  value={searchValue}
                  onChange={handleChange}
                  className="w-full h-[61px] pl-[50px] rounded-xl text-[13px] md:text-[16px] md:font-medium text-[#817676] placeholder-[#817676] focus:outline-none"
                />
                {!searchValue && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 h-[25px] w-[25px] text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                )}
              </div>

              <div className="h-[42px] w-[25%] hidden md:flex rounded-lg items-center justify-center border border-[#6B6D6E] bg-[#e8e9ea] space-x-2">
                <h1 className="text-[#2D3A4B] text-[14px] leading-[21px] font-medium">
                  All Filters
                </h1>
                <RiArrowDropDownLine className="h-[20px] w-[20px] text-[#2D3A4B]" />
              </div>
            </div>
          </form>
        </div>

        {/* Moving Text */}
        <div className="w-full md:w-[30%] h-[40px] relative overflow-hidden whitespace-nowrap">
          <div className="moving-div flex">
            {mockkdata.map((item, index) => (
              <p key={index} className="text-sm mx-4 w-auto">
                {item.data}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="min-h-[930px] mx-auto bg-white mt-4 rounded-lg mb-24 p-4 md:p-6">
        <div className="flex bg-[#9B51E052] bg-opacity-[35%] md:bg-[#9B51E052] xl:bg-transparent h-[80px] rounded-xl xl:max-h-20 justify-between align-middle items-center px-5 md:px-5 xl:px-12 mt-10 max-w-[92%] mx-auto">
          <h1 className="text-[18px] font-medium leading-[22px] text-[#333333]">
            Recent activity
          </h1>
          <div className="flex justify-end">
            <Button className="flex rounded-lg bg-[#4A90E21F] py-2 px-4 h-[42px] items-center w-[90px] text-sm text-[#5801A9]">
              <Image src={filter} alt="filter" className="mr-2" />
              <span className="text-[11px]">Filter</span>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-[92%] mx-auto mt-6">
          {/* Mobile, Tablet, and Small Desktop View */}
          <div className="block xl:hidden space-y-4 px-4">
            {currentItems.map((data, index) => (
              <TableList
                key={index}
                timestamp={data.timestamp}
                address={data.address}
                status={data.status}
                category={data.category}
              />
            ))}
          </div>

          {/* Large Desktop View */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3 min-w-[800px]">
              <thead>
                <tr className="h-[56px] text-[14px] bg-[#9B51E052] font-normal text-[#5801A9] leading-[19.79px]">
                  <th className="text-center font-light rounded-tl-xl rounded-bl-xl whitespace-nowrap px-4">
                    Timestamp
                  </th>
                  <th className="text-center font-light whitespace-nowrap px-4">
                    Wallet Address
                  </th>
                  <th className="text-center font-light whitespace-nowrap px-4">
                    Activity Status
                  </th>
                  <th className="text-center font-light rounded-tr-xl rounded-br-xl whitespace-nowrap px-4">
                    Course/Event/Bootcamp
                  </th>
                </tr>
              </thead>
              {currentItems.map((data, index) => (
                <TableList
                  key={index}
                  timestamp={data.timestamp}
                  address={data.address}
                  status={data.status}
                  category={data.category}
                />
              ))}
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-8 overflow-x-auto py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 border border-[#D0D5DD] rounded disabled:opacity-50"
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
                onClick={() => setCurrentPage(Number(page))}
                className={`px-3 md:px-4 py-2 rounded text-[14px] ${
                  currentPage === page
                    ? "border border-[#F56630] text-black"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 md:px-4 py-2 border border-[#D0D5DD] rounded disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
