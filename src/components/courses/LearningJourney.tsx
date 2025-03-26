import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Image from "next/image";
import play from "@/assets/play.svg";
import tdesign_video from "@/assets/tdesign_video.svg";

interface ItemProps {
  no: number;
  title: string;
  tag: string;
  playTime: string;
  level: string;
  stars: number;
  url: string;
  certificate: number;
}

interface LearningJourneyProps {
  item: ItemProps; // or another type like `number` or a union type
  selected: string; // Replace with appropriate type
  takenCoursesData: any;
}

const LearningJourney: React.FC<LearningJourneyProps> = ({
  item,
  selected,
  takenCoursesData,
}) => {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(takenCoursesData.length / itemsPerPage);

  // Get current page items
  const currentItems = takenCoursesData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const generatePageNumbers = () => {
    const pageNumbers = [];

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

  if (takenCoursesData.length === 0) {
    return <div className="text-[#A01B9B] text-center mt-12">No Courses</div>;
  }

  return (
    <div className="bg-white my-0 sm:my-12 rounded-xl  border-[1px] border-[#BCBCBC] h-auto pb-8">
      <div>
        <div>
          {item.no == 1 ? (
            <div className="flex justify-between  border-b-[1px] border-b-[#CACBCB] my-3 px-10">
              <div className="flex text-gradient-to-r from-purple-400 via-purple-30 mx-8 my-5">
                <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
              </div>
              <div className="hidden sm:flex mx-8 my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                  />
                </svg>

                <p className="underline">All</p>
              </div>
            </div>
          ) : null}

          <div>
            {currentItems?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="px-5 xl:px-12 flex border-top py-4 border-2 gap-12 xl:gap-0 flex-col w-full xl:flex-row xl:space-x-12 items-center"
                >
                  <div className="xl:h-[164px] xl:w-[254px] w-full h-auto rounded-xl">
                    <Image
                      src={
                        item.data.courseImage
                          ? `https://ipfs.io/ipfs/${item?.data.courseImage}`
                          : tdesign_video
                      }
                      width={200}
                      height={200}
                      alt={item.data.courseName}
                      className="object-cover h-full w-full rounded-xl"
                    />
                  </div>

                  <div className="!ml-0 px-3 xl:px-0 mt-5 xl:!mx-8 flex-1 w-full">
                    <div>
                      <h4 className="text-[20px] font-medium leading-[22px] text-[#2D3A4B]">
                        {item.data.courseName}
                      </h4>

                      <div className="flex flex-wrap xl:flex-nowrap gap-y-2 gap-4 xl:gap-0 items-center my-3 ">
                        <div className="flex items-center gap-2">
                          <Image src={play} alt="" height={12} width={12} />
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                            Total play time: 2 hrs 35 mins
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="hidden sm:block">|</p>
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                            Created by:{" "}
                            <span className="underline">
                              {item.data.courseCreator}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="my-3">
                      <ProgressBar
                        completed={"58"}
                        height="13px"
                        bgColor="#9B51E0"
                      />
                    </div>

                    <div className="my-3 flex justify-between">
                      <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                        3/6 Lectures completed
                      </p>
                      <p className="underline text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                        (8:03 mins)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

export default LearningJourney;
