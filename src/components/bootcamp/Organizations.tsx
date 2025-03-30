import React, { useState, useEffect, useMemo } from "react";
import Organizationcard from "./Organizationcard";

interface Organization {
  address_of_org: string;
  [key: string]: any;
}

interface OrganizationsProps {
  allorginfo: Organization[];
}

const Organizations: React.FC<OrganizationsProps> = ({ allorginfo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allorginfo]);

  // Calculate pagination values
  const { currentItems, totalPages } = useMemo(() => {
    const totalItems = Array.isArray(allorginfo) ? allorginfo.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const currentItems = Array.isArray(allorginfo)
      ? allorginfo.slice(startIndex, endIndex)
      : [];

    return { currentItems, totalPages };
  }, [allorginfo, currentPage]);

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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="h-auto w-full flex flex-col justify-center items-center space-y-4">
      <h1 className="w-[90%] mx-auto text-sm text-[#333333] font-bold">
        Top rated Organization
      </h1>
      <div className="h-auto w-[90%] mx-auto bg-[#FFFFFF] border-[1px] border-[#C8C8C8] rounded-lg p-4 xl:p-8">
        {currentItems.length === 0 ? (
          <div className="text-center py-8">No organizations found</div>
        ) : (
          <>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-stretch xl:grid-cols-4">
              {currentItems.map((data, index) => (
                <div
                  key={`${data.address_of_org}-${index}`}
                  className="col-span-1 flex flex-none w-full"
                >
                  <Organizationcard
                    orgaddress={data.address_of_org}
                    org_data={data}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 pb-4 pt-10">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 border-[#D0D5DD] border-[1px] rounded disabled:opacity-50"
                >
                  {"<"}
                </button>

                {generatePageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-base mt-2"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
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
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 border-[#D0D5DD] border-[1px] text-sm rounded disabled:opacity-50"
                >
                  {">"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Organizations;
