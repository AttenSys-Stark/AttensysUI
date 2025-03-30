import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HighlightData } from "@/constants/data";
import Highlightcard from "./Highlightcard";
import { useRouter } from "next/navigation";
import { EventData } from "./DiscoverLanding";

interface HighlightProps {
  events: EventData[];
}

const Highlight: React.FC<HighlightProps> = ({ events }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to first page when events change
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // Calculate pagination values
  const { currentItems, totalPages } = useMemo(() => {
    const totalItems = events?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const currentItems = events?.slice(startIndex, endIndex) || [];

    return { currentItems, totalPages };
  }, [events, currentPage]);

  const handleEventClick = (event: EventData, eventID: number) => {
    router.push(`/Eventpage/${event.event_name}/?id=${eventID}`);
  };

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 1) return pageNumbers;

    // Always show first page if not in initial range
    if (currentPage > 2) pageNumbers.push(1);

    // Show ellipsis if needed
    if (currentPage > 3) pageNumbers.push("...");

    // Calculate range around current page
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(currentPage + 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) pageNumbers.push("...");

    // Always show last page if different from first
    if (currentPage < totalPages - 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="mt-32 sm:mt-24 w-full p-4 sm:p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:w-[90%] items-center mb-20 gap-8">
        {currentItems.length === 0 ? (
          <div className="col-span-full text-center text-white py-8">
            No events found
          </div>
        ) : (
          currentItems.map((data, index) => (
            <Highlightcard
              onClick={() => handleEventClick(data, index + 1)}
              key={`${data.event_name}-${index}`}
              uri_data={data.event_uri}
              time={data.time}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pb-10 text-white">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-1.5 border-white text-white border-[1px] rounded disabled:opacity-50"
          >
            {"<"}
          </button>
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-base mt-2 text-white"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => goToPage(page as number)}
                className={`px-4 py-1.5 rounded text-[14px] ${
                  currentPage === page
                    ? "bg-none text-white border-[#9B51E0] border-[1px]"
                    : "bg-none text-white"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 border-white border-[1px] text-sm rounded disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      )}
    </>
  );
};

export default Highlight;
