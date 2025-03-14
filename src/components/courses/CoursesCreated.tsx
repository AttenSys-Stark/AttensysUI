import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaUserGraduate } from "@react-icons/all-files/fa/FaUserGraduate";
import Switch from "react-switch";
import StarRating from "../bootcamp/StarRating";
import play from "@/assets/play.svg";
import replay from "@/assets/replay.svg";
import bdot from "@/assets/Bdot.svg";
import diamond from "@/assets/diamond.svg";
import certificationBadge from "@/assets/certification_badge.svg";
import tdesign_video from "../../assets/tdesign_video.svg";

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

interface CoursesCreatedProps {
  item: ItemProps; // or another type like `number` or a union type
  selected: string;
  courseData: any;
}

interface CourseType {
  owner: string;
  course_identifier: number;
  accessment: boolean;
  uri: Uri;
  course_ipfs_uri: string;
  is_suspended: boolean;
}

interface Uri {
  first: string;
  second: string;
}

const CoursesCreated: React.FC<CoursesCreatedProps> = ({
  item,
  selected,
  courseData,
}) => {
  const [isActivated, setIsActivated] = useState(false);

  const handleSwitch = () => {
    setIsActivated(!isActivated);
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(courseData.length / itemsPerPage);

  // Get current page items
  const currentItems = courseData.slice(
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

  if (courseData.length === 0) {
    return <div className="text-[#A01B9B] text-center mt-12">No Courses</div>;
  }
  return (
    <div className="bg-white  sm:my-12 rounded-xl border-[1px] border-[#BCBCBC] h-auto pb-8">
      {/* courses created */}
      <div>
        <div className="flex justify-between border-b-[1px] border-b-[#CACBCB] my-3 px-16">
          {/* activate */}
          <div className="flex items-center text-[#A01B9B]  my-5 space-x-3">
            <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
            <FaUserGraduate color="#A01B9B" />
          </div>
          <div className="hidden sm:flex items-center  my-5">
            <p className={`${!isActivated ? "text-[#4A90E2]" : "text-black"} `}>
              Deactivate
            </p>

            <Switch
              onChange={handleSwitch}
              checked={isActivated}
              onColor="#9B51E0"
              offColor="#4A90E2"
              uncheckedHandleIcon={<div />}
              checkedHandleIcon={<div />}
              checkedIcon={<div />}
              uncheckedIcon={<div />}
              className="mx-2"
            />
            <p className={`${isActivated ? "text-[#9B51E0]" : "text-black"} `}>
              Activate
            </p>
          </div>
        </div>

        <div>
          <div className="block justify-top ">
            <div className="flex sm:hidden items-center mx-8 my-5 text-xs">
              <p
                className={`${!isActivated ? "text-[#4A90E2]" : "text-black"} `}
              >
                Deactivate
              </p>
              <Switch
                onChange={handleSwitch}
                checked={isActivated}
                onColor="#9B51E0"
                offColor="#4A90E2"
                uncheckedHandleIcon={<div />}
                checkedHandleIcon={<div />}
                checkedIcon={<div />}
                uncheckedIcon={<div />}
                className="mx-2"
              />
              <p
                className={`${isActivated ? "text-[#9B51E0]" : "text-black"} `}
              >
                Activate
              </p>
            </div>

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
                          ? `https://ipfs.io/ipfs/${item.data.courseImage}`
                          : tdesign_video
                      }
                      width={200}
                      height={200}
                      alt={item.data.courseName}
                      className="object-cover h-full w-full rounded-xl"
                    />
                  </div>
                  <div className="flex-1 w-full lg:mx-6 sm:mx-0">
                    <div>
                      <h4 className="text-[20px] font-medium leading-[22px] text-[#2D3A4B]">
                        {item.data.courseName}
                      </h4>

                      <div className="text-[#2D3A4B] flex flex-wrap items-center gap-3 my-3">
                        <div className="flex items-center gap-x-2">
                          <Image src={play} alt="" height={12} width={12} />
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                            Total play time: {item.playTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-x-2 ">
                          <p className="hidden sm:block">|</p>
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                            Created by:{" "}
                            <span className="text-[#A01B9B]">you</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Image src={bdot} alt="" height={12} width={12} />
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                            <span className="text-[#A01B9B]">
                              {item.data.courseCurriculum.length}
                            </span>{" "}
                            Lectures
                          </p>
                        </div>
                      </div>

                      <div className="text-[#2D3A4B] flex flex-wrap gap-4 items-center my-3">
                        <div className="flex items-center gap-x-2">
                          <Image
                            src={replay}
                            alt="time"
                            width={16}
                            height={16}
                            className=""
                          />
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                            Last updated 10|10|2024
                          </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Image src={diamond} alt="" height={18} width={18} />
                          <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                            Difficulty level: {item.level}
                          </p>
                        </div>
                      </div>

                      <div className="text-[#2D3A4B] flex flex-wrap gap-5 items-center my-3">
                        <div className="flex items-center gap-x-2">
                          <StarRating totalStars={5} starnumber={4} />
                          <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">
                            {item.stars} students
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mx-0 sm:my-0">
                          <Image
                            src={certificationBadge}
                            alt=""
                            height={18}
                            width={18}
                          />
                          <p className="font-medium text-[13px] mr-1 text-[#2D3A4B] leading-[16px]">
                            Certificate issued:
                          </p>
                          <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">
                            <span className="text-[#A01B9B]">
                              {item.certificate}{" "}
                            </span>
                            certificates
                          </p>
                        </div>
                      </div>
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

export default CoursesCreated;
