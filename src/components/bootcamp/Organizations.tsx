import React, { useState } from "react";
import Organizationcard from "./Organizationcard";
import { organizationData } from "@/constants/data";

const Organizations = (props: any) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // Calculate total pages
  const totalPages = Math.ceil(props.allorginfo.length / itemsPerPage);

  // Get current page items
  const currentItems = props.allorginfo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-auto w-full flex flex-col justify-center items-center space-y-4">
      <h1 className="w-[90%] mx-auto text-sm text-[#333333] font-bold">
        Top rated Organization
      </h1>
      <div className="h-auto w-[90%] mx-auto bg-[#FFFFFF] border-[1px] border-[#C8C8C8] rounded-lg p-4 xl:p-8">
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-stretch xl:grid-cols-4">
          {currentItems.map((data: any, index: any) => {
            return (
              <div key={index} className="col-span-1 flex flex-none w-full">
                <Organizationcard
                  key={index}
                  orgaddress={data.address_of_org}
                  org_data={data}
                />
              </div>
            );
          })}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2 pb-4 pt-10">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-1.5 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
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
                className={`px-4 py-1.5 rounded text-[14px] ${currentPage == page ? "bg-none text-[#000000] border-[#9B51E0] border-[1px]" : "bg-none text-[#000000]"}`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 border-[#D0D5DD] border-[1px] text-sm rounded disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
