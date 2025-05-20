// ExploreResult.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button, Input } from "@headlessui/react";
import Image from "next/image";
import filter from "@/assets/filter.png";
import organization from "@/assets/octicon_organization-24.svg";
import { RiArrowDropDownLine } from "react-icons/ri";
import { eventsData, gridsData } from "@/constants/data";
import ResultGrid from "./ResultGrid";
import { handleSubmit, shortenAddress } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { createPortal } from "react-dom";
import { Contract } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
import { useFetchCID } from "@/hooks/useFetchCID";

type Params = {
  address?: string;
};

interface CourseType {
  accessment: boolean;
  course_identifier: number;
  course_ipfs_uri: string;
  is_approved: boolean;
  is_suspended: boolean;
  owner: string;
  price: number;
  uri: string;
  block_timestamp?: number;
}

interface ResultDataItem {
  type: string;
  courseData?: {
    courseName?: string;
    courseCreator?: string;
    courseDescription?: string;
    courseImage?: string;
    courseCurriculum?: any[];
    difficultyLevel?: string;
    playTime?: string;
    stars?: number;
    certificate?: string;
  };
  course_identifier?: number;
}

const ExploreResult: React.FC<{ params: Params }> = ({
  params,
}): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { address } = params;
  const [resultData, setResultData] = useState<ResultDataItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const { fetchCIDContent } = useFetchCID();
  const [coursesData, setCoursesData] = useState<CourseType[]>([]);
  const [processedCoursesData, setProcessedCoursesData] = useState<any[]>([]);
  const [noOrg, setNoOrg] = useState(true);

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

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  React.useEffect(() => {
    if (!address) return;

    const fetchUserData = async () => {
      try {
        // Get created courses
        const createdCourses: CourseType[] =
          await courseContract?.get_all_creator_courses(address);

        // Get taken courses
        const takenCourses: CourseType[] =
          await courseContract?.get_all_taken_courses(address);

        console.log("createdCourses", createdCourses);
        console.log("takenCourses", takenCourses);

        // Combine created and taken courses
        const allCourses = [...createdCourses, ...takenCourses];
        setCoursesData(allCourses);

        // Process courses with IPFS data
        const processedCourses = await Promise.all(
          allCourses.map(async (course) => {
            try {
              const courseData = await fetchCIDContent(course.course_ipfs_uri);
              if (!courseData || !courseData.data) return null;

              // Check if user is certified for this course
              const isCertified =
                await courseContract?.is_user_certified_for_course(
                  address,
                  course.course_identifier,
                );

              return {
                type: "COURSE",
                eventName: courseData.data.courseName || "Unnamed Course",
                status: course.is_approved ? "Approved" : "Pending",
                date: formatTimestamp(
                  course.block_timestamp || Date.now() / 1000,
                ),
                certification: "Certificate Available",

                nftImg: courseData.data.courseImage
                  ? `https://ipfs.io/ipfs/${courseData.data.courseImage}`
                  : "",
                data: {
                  ...courseData.data,
                  course_identifier: course.course_identifier,
                  is_approved: course.is_approved,
                  is_suspended: course.is_suspended,
                  price: course.price,
                  owner: course.owner,
                  isCertified,
                },
              };
            } catch (error) {
              console.error("Error processing course:", error);
              return null;
            }
          }),
        );

        // Filter out any null values and set the processed data
        const validProcessedCourses = processedCourses.filter(Boolean);
        setProcessedCoursesData(validProcessedCourses);

        // Get course identifiers for taken courses
        const courseIdentifiers = takenCourses.map((data) =>
          Number(data.course_identifier),
        );

        // Process created courses
        const createdCoursesData = await Promise.all(
          createdCourses.map(async (course: CourseType) => {
            try {
              const courseData = await fetchCIDContent(course.course_ipfs_uri);
              if (!courseData || !courseData.data) return null;

              return {
                type: "COURSE_CREATED",
                eventName: courseData.data.courseName || "New Course",
                status: "Course Created",
                date: formatTimestamp(
                  course.block_timestamp || Date.now() / 1000,
                ),
                certification: "View certifications",
                nftImg: courseData.data.courseImage
                  ? `https://ipfs.io/ipfs/${courseData.data.courseImage}`
                  : "",
                data: courseData.data,
              };
            } catch (error) {
              console.error("Error processing created course:", error);
              return null;
            }
          }),
        );

        // Process taken courses
        const takenCoursesData = await Promise.all(
          takenCourses.map(async (course: CourseType) => {
            try {
              const courseData = await fetchCIDContent(course.course_ipfs_uri);
              if (!courseData || !courseData.data) return null;

              // Check if user is certified for this course
              const isCertified =
                await courseContract?.is_user_certified_for_course(
                  address,
                  course.course_identifier,
                );

              if (isCertified) {
                return {
                  type: "CERT_CLAIMED",
                  eventName: "Certificate Claimed",
                  status: "Certificate Claimed",
                  date: formatTimestamp(
                    course.block_timestamp || Date.now() / 1000,
                  ),
                  certification: "View certifications",
                  nftImg: courseData.data.courseImage
                    ? `https://ipfs.io/ipfs/${courseData.data.courseImage}`
                    : "",
                  data: courseData.data,
                };
              }

              return {
                type: "COURSE_TAKEN",
                eventName: courseData.data.courseName || "Course Taken",
                status: "Course Taken",
                date: formatTimestamp(
                  course.block_timestamp || Date.now() / 1000,
                ),
                certification: "View certifications",
                nftImg: courseData.data.courseImage
                  ? `https://ipfs.io/ipfs/${courseData.data.courseImage}`
                  : "",
                data: courseData.data,
              };
            } catch (error) {
              console.error("Error processing taken course:", error);
              return null;
            }
          }),
        );

        // Combine and filter out null values
        const allData = [...createdCoursesData, ...takenCoursesData].filter(
          Boolean,
        );
        console.log("allData", allData);
        setResultData(allData as ResultDataItem[]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setResultData([]);
      }
    };

    fetchUserData();
  }, [address, fetchCIDContent]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "Invalid date";
    return format(date, "MMM dd, yyyy HH:mm:ss");
  };

  // Update the gridsData transformation
  const updatedGridsData = React.useMemo(() => {
    return gridsData.map((grid) => {
      switch (grid.name) {
        case "Events": {
          const eventData = resultData.filter((item: any) =>
            ["COURSE_TAKEN"].includes(item.type),
          );

          return {
            ...grid,
            eventsData: [...grid.eventsData, ...eventData],
          };
        }

        case "Courses": {
          // Use processedCoursesData if available
          if (processedCoursesData.length > 0) {
            console.log("Using processedCoursesData for display");
            return {
              ...grid,
              eventsData: processedCoursesData,
            };
          }

          const courseData = resultData.filter((item: any) =>
            ["COURSE_CREATED", "COURSE_TAKEN"].includes(item.type),
          );

          return {
            ...grid,
            eventsData: [...grid.eventsData, ...courseData],
          };
        }

        case "Certifications": {
          const certData = resultData.filter((item: any) =>
            ["CERT_CLAIMED"].includes(item.type),
          );

          return {
            ...grid,
            eventsData: [...grid.eventsData, ...certData],
          };
        }

        default:
          return grid;
      }
    });
  }, [resultData, gridsData, processedCoursesData]);

  const filteredGridsData = React.useMemo(() => {
    if (activeFilter === "All") return updatedGridsData;
    return updatedGridsData.filter((item) => item.name === activeFilter);
  }, [updatedGridsData, activeFilter]);

  const handleSubmit = (
    e: React.FormEvent,
    searchValue: string,
    router: any,
  ) => {
    e.preventDefault();
    if (searchValue) {
      router.push(`/Explorer/${searchValue}`);
    }
  };

  const updateDropdownPosition = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 120,
      });
    }
  };

  useEffect(() => {
    if (isFilterOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isFilterOpen]);

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
                    placeholder="Search an address | course | organization"
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
                  <button
                    ref={filterButtonRef}
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-center space-x-2 w-full h-full"
                  >
                    <h1 className="text-[#2D3A4B] text-[14px] leading-[21px] font-medium">
                      {activeFilter}
                    </h1>
                    <RiArrowDropDownLine className="h-[20px] w-[20px] text-[#2D3A4B]" />
                  </button>

                  {isFilterOpen &&
                    typeof window !== "undefined" &&
                    createPortal(
                      <div
                        className="fixed w-[120px] bg-[#F5F7FA] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-[9999] border border-[#e8e9ea]"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                      >
                        {[
                          "All",
                          "Events",
                          "Organizations",
                          "Certifications",
                          "Courses",
                        ].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setActiveFilter(filter);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-200 ${
                              activeFilter === filter
                                ? "bg-[#4A90E2] text-white"
                                : "text-[#2D3A4B] hover:bg-[#4A90E21F]"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>,
                      document.body,
                    )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap lg:flex-nowrap gap-3 my-5">
          {["All", "Events", "Organizations", "Certifications", "Courses"].map(
            (category, index) => (
              <Button
                key={index}
                onClick={() => setActiveFilter(category)}
                className={` lg:flex rounded-lg py-2 px-4 h-[42px] items-center w-[100px] text-sm ${
                  activeFilter === category
                    ? "bg-[#4A90E2] text-white"
                    : "bg-[#4A90E21F] text-[#2d3a4b]"
                }`}
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
      <div className="mx-4 lg:mx-36 mb-12">
        {activeFilter === "All" ? (
          // Show all grids when "All" is selected
          <>
            {updatedGridsData.map((item: any, i: any) => (
              <ResultGrid
                key={i}
                address={address || ""}
                item={item}
                eventsData={item.eventsData}
                generatePageNumbers={generatePageNumbers}
                goToPage={goToPage}
                currentPage={currentPage}
              />
            ))}
            {/* Organizations Overview Table - Show when "All" is selected */}
            <div className="bg-white rounded-lg py-5 border border-[#b9b9ba] mt-6 mb-6">
              <div className="border-b-2 border-[#b9b9ba] mx-4 sm:mx-0 sm:flex">
                <div className="flex gap-2 w-auto rounded-xl sm:ml-12 sm:mr-6 items-center border-[1px] border-[#6B6D6E] p-3 mb-3 w-64">
                  <Image
                    src={organization}
                    alt="organization"
                    className="mr-2"
                  />
                  <h1>Organizations Overview</h1>
                </div>

                <div className="bg-[#9B51E052] flex gap-2 w-auto rounded-xl items-center px-4 sm:py-0 py-2 mb-3 w-48">
                  <h1 className="text-[12px] text-[#9B51E0] font-medium leading-[12px]">
                    <span className="text-[#9B51E0]">0</span> Organizations
                    found
                  </h1>
                </div>
              </div>

              {noOrg ? (
                <div className="w-full min-h-[308px] flex items-center justify-center">
                  <div className="mx-4 lg:mx-12">
                    <p>This address has no organization data</p>
                  </div>
                </div>
              ) : (
                <div className="mx-4 lg:mx-12">
                  <div className="overflow-x-auto -mx-4 lg:mx-0">
                    <div className="min-w-[800px]">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-left">
                              Key
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Status
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Organizations | Courses
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Tutors
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Certifications
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Created
                            </th>
                            <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                              Students
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-3 lg:px-6">
                              <span className="text-[12px] lg:text-[14px] text-[#333333] break-all">
                                {shortenAddress(address)}
                              </span>
                            </td>
                            <td className="py-3 px-3 lg:px-6">
                              <div className="inline-flex p-1.5 lg:p-2 rounded-lg text-[10px] lg:text-xs items-center justify-center bg-[#C4FFA2] text-[#115E2C]">
                                Verified
                              </div>
                            </td>
                            <td className="py-3 px-3 lg:px-6 text-center">
                              <span className="text-[12px] lg:text-[14px] text-[#333333]">
                                0 | 0
                              </span>
                            </td>
                            <td className="py-3 px-3 lg:px-6 text-center">
                              <span className="text-[12px] lg:text-[14px] text-[#333333]">
                                0
                              </span>
                            </td>
                            <td className="py-3 px-3 lg:px-6 text-center">
                              <span className="text-[12px] lg:text-[14px] text-[#333333]">
                                0
                              </span>
                            </td>
                            <td className="py-3 px-3 lg:px-6 text-center">
                              <span className="text-[12px] lg:text-[14px] text-[#333333]">
                                2024-03-15
                              </span>
                            </td>
                            <td className="py-3 px-3 lg:px-6 text-center">
                              <span className="text-[12px] lg:text-[14px] text-[#333333]">
                                0
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td
                              colSpan={7}
                              className="py-4 lg:py-6 px-3 lg:px-6"
                            >
                              <div className="text-[12px] lg:text-[14px] text-[#333333] leading-relaxed">
                                <h3 className="font-medium mb-2">
                                  Organization Information
                                </h3>
                                <p className="text-[#817676]">
                                  This organization is dedicated to providing
                                  high-quality educational content and
                                  professional development opportunities. With a
                                  focus on blockchain technology and
                                  decentralized learning, we offer comprehensive
                                  courses designed to equip students with
                                  practical skills and industry-relevant
                                  knowledge. Our curriculum is regularly updated
                                  to reflect the latest developments in the
                                  field, ensuring that our students stay ahead
                                  of the curve. We maintain a strong commitment
                                  to academic excellence and student success,
                                  supported by our team of experienced educators
                                  and industry professionals.
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeFilter === "Organizations" ? (
          // Show only Organizations Overview when "Organizations" is selected
          <div className="w-full  bg-white rounded-lg py-5 border border-[#b9b9ba] mt-6">
            <div className="border-b-2 border-[#b9b9ba] mx-4 sm:mx-0 sm:flex">
              <div className="flex gap-2 w-auto rounded-xl sm:ml-12 sm:mr-6 items-center border-[1px] border-[#6B6D6E] p-3 mb-3 w-64">
                <Image src={organization} alt="organization" className="mr-2" />
                <h1>Organizations Overview</h1>
              </div>

              <div className="bg-[#9B51E052]  flex gap-2 w-auto rounded-xl items-center px-4 sm:py-0 py-2 mb-3 w-48 ">
                <h1 className="text-[12px] text-[#9B51E0] font-medium leading-[12px]">
                  <span className="text-[#9B51E0]">0</span> Organizations found
                </h1>
              </div>
            </div>

            {noOrg ? (
              <div className="w-full min-h-[308px] flex items-center justify-center">
                <div className="mx-4 lg:mx-12">
                  <p>This address has no organization data</p>
                </div>
              </div>
            ) : (
              <div className="mx-4 lg:mx-12 mt-12">
                <div className="overflow-x-auto mx-4 lg:mx-0">
                  <div className="min-w-[800px]">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-left">
                            Key
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Status
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Organizations | Courses
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Tutors
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Certifications
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Created
                          </th>
                          <th className="py-3 px-3 lg:px-6 border-b-2 border-[#b9b9ba] text-[12px] text-center">
                            Students
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 lg:px-6">
                            <span className="text-[12px] lg:text-[14px] text-[#333333] break-all">
                              {shortenAddress(address)}
                            </span>
                          </td>
                          <td className="py-3 px-3 lg:px-6">
                            <div className="inline-flex p-1.5 lg:p-2 rounded-lg text-[10px] lg:text-xs items-center justify-center bg-[#C4FFA2] text-[#115E2C]">
                              Verified
                            </div>
                          </td>
                          <td className="py-3 px-3 lg:px-6 text-center">
                            <span className="text-[12px] lg:text-[14px] text-[#333333]">
                              0 | 0
                            </span>
                          </td>
                          <td className="py-3 px-3 lg:px-6 text-center">
                            <span className="text-[12px] lg:text-[14px] text-[#333333]">
                              0
                            </span>
                          </td>
                          <td className="py-3 px-3 lg:px-6 text-center">
                            <span className="text-[12px] lg:text-[14px] text-[#333333]">
                              0
                            </span>
                          </td>
                          <td className="py-3 px-3 lg:px-6 text-center">
                            <span className="text-[12px] lg:text-[14px] text-[#333333]">
                              2024-03-15
                            </span>
                          </td>
                          <td className="py-3 px-3 lg:px-6 text-center">
                            <span className="text-[12px] lg:text-[14px] text-[#333333]">
                              0
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td colSpan={7} className="py-4 lg:py-6 px-3 lg:px-6">
                            <div className="text-[12px] lg:text-[14px] text-[#333333] leading-relaxed">
                              <h3 className="font-medium mb-2">
                                Organization Information
                              </h3>
                              <p className="text-[#817676]">
                                This organization is dedicated to providing
                                high-quality educational content and
                                professional development opportunities. With a
                                focus on blockchain technology and decentralized
                                learning, we offer comprehensive courses
                                designed to equip students with practical skills
                                and industry-relevant knowledge. Our curriculum
                                is regularly updated to reflect the latest
                                developments in the field, ensuring that our
                                students stay ahead of the curve. We maintain a
                                strong commitment to academic excellence and
                                student success, supported by our team of
                                experienced educators and industry
                                professionals.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : filteredGridsData.length > 0 ? (
          // Show filtered grid when there are matches
          filteredGridsData.map((item: any, i: any) => (
            <ResultGrid
              key={i}
              address={address || ""}
              item={item}
              eventsData={item.eventsData}
              generatePageNumbers={generatePageNumbers}
              goToPage={goToPage}
              currentPage={currentPage}
            />
          ))
        ) : (
          // Show empty state when no matches
          <div className="w-full h-[308px] flex items-center justify-center bg-white rounded-lg border border-[#b9b9ba]">
            <div className="text-center">
              <h1 className="text-[15px] text-[#817676] font-medium leading-[18px]">
                No {activeFilter.toLowerCase()} data found
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreResult;
