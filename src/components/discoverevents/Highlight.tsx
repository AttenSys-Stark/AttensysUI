import React, { useState } from "react";
import Image from "next/image";
import { HighlightData } from "@/constants/data";
import Highlightcard from "./Highlightcard";
import { useRouter } from "next/navigation";
import { EventData } from "./DiscoverLanding";

const Highlight = ({ events }: { events: EventData[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleEventClick = (prop: any, eventID: any) => {
    router.push(`/Eventpage/${prop.event_name}/?id=${Number(eventID)}`);
  };

  const itemsPerPage = 12;

  // Calculate total pages
  const totalPages = Math.ceil(events.length / itemsPerPage);

  // Get current page items
  const currentItems = events.slice(
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
    <>
      <div className="mt-32 sm:mt-24 w-full p-4 sm:p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:w-[90%] items-center mb-20 gap-8">
        {currentItems.map((data, index) => {
          return (
            <Highlightcard
              onClick={() => handleEventClick(data, index + 1)}
              key={index}
              uri_data={data.event_uri}
              time={data.time}
            />
          );
        })}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 pb-10 text-white">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-1.5 border-white text-white border-[1px] rounded disabled:opacity-50"
        >
          {"<"}
        </button>
        {generatePageNumbers().map((page, index) =>
          page == "..." ? (
            <span key={index} className="px-2 text-base mt-2 text-white">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => goToPage(page)}
              className={`px-4 py-1.5 rounded text-[14px] ${currentPage == page ? "bg-none text-white border-[#9B51E0] border-[1px]" : "bg-none text-white"}`}
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
    </>
  );
};

export default Highlight;
