"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SlExclamation } from "react-icons/sl";
import up from "@/assets/up.svg";
import down from "@/assets/down.svg";
import show_arrow from "@/assets/show_arrow.svg";
import { IoClose } from "react-icons/io5";
import { shortenAddress } from "@/utils/helpers";
import { api } from "@/services/api";
import { format } from "date-fns";

interface Events {
  type: string;
  eventName: string;
  status: string;
  certification: string;
  nftImg: string;
  date: string;
  courseIdentifier?: number;
  timestamp?: string;
  data?: any;
  id?: number;
}

interface GridItem {
  img: string;
  name: string;
  subProp: string[];
  viewPartName: string;
  heading: string[];
  eventsData: Array<{
    type: string;
    eventName: string;
    status: string;
    certification: string;
    nftImg: string;
    date: string;
    courseIdentifier?: number;
    timestamp?: string;
    data?: any;
    id?: number;
  }>;
}

interface ResultGridProps {
  address: string;
  item: GridItem;
  eventsData: Events[];
  generatePageNumbers: () => (string | number)[];
  goToPage: (page: any) => void;
  currentPage: number;
}

const ResultGrid: React.FC<ResultGridProps> = ({
  address,
  item,
  eventsData,
  generatePageNumbers,
  goToPage,
  currentPage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [certificationDates, setCertificationDates] = useState<{
    [key: number]: string;
  }>({});

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  // Fetch certification dates from API
  useEffect(() => {
    const fetchCertificationDates = async () => {
      try {
        // Get all events for this address
        const events = await api.getEventsByAddress(address);

        // Get all courses info from blockchain
        const allCoursesInfo = await api.getAllCoursesInfo();

        // Create a mapping of course events to their timestamps
        const eventDates: { [key: number]: string } = {};

        // First, try to get dates from API events
        events.forEach((event: any) => {
          if (event.courseIdentifier) {
            let formattedDate = "";

            if (event.type === "COURSE_ACQUIRED") {
              // Course acquisition date
              const date = new Date(event.timestamp);
              formattedDate = format(date, "MMM dd, yyyy HH:mm:ss");
            } else if (event.type === "CERT_CLAIMED") {
              // Certification date
              const date = new Date(event.timestamp);
              formattedDate = format(date, "MMM dd, yyyy HH:mm:ss");
            }

            if (formattedDate) {
              eventDates[event.courseIdentifier] = formattedDate;
            }
          }
        });

        // If we don't have enough dates from API events, use blockchain data directly
        if (Object.keys(eventDates).length === 0 && allCoursesInfo.length > 0) {
          allCoursesInfo.forEach((course: any) => {
            if (course.course_identifier && course.block_timestamp) {
              const date = new Date(course.block_timestamp * 1000);
              const formattedDate = format(date, "MMM dd, yyyy HH:mm:ss");
              eventDates[Number(course.course_identifier)] = formattedDate;
            }
          });
        }

        setCertificationDates(eventDates);
      } catch (error) {
        console.error("Error fetching certification dates:", error);
      }
    };

    if (address && item.eventsData.length > 0) {
      fetchCertificationDates();
    }
  }, [address, item.eventsData]);

  // Check if any events have status data
  const hasStatusData = item.eventsData.some(
    (event) => event.status && event.status.trim() !== "",
  );

  // Check if any events have certification data
  const hasCertificationData = item.eventsData.some(
    (event) => event.certification && event.certification.trim() !== "",
  );

  const renderContent = (arg: string) => {
    const certCount = item.eventsData.filter(
      (event) => event.type === "COURSE",
    ).length;
    const completedCourses = item.eventsData.filter(
      (event) => event.type === "COURSE",
    ).length;
    const ongoingCourses = item.eventsData.filter(
      (event) => event.type === "CERT_CLAIMED",
    ).length;
    const eventCerts = item.eventsData.filter(
      (event) => event.type === "COURSE_CREATED",
    ).length;

    switch (arg) {
      case "Key":
        return (
          <p className="text-[12px] font-medium leading-[16px] text-[#817676]">
            Address{" "}
            <span className="text-[#5801A9] text-[10px]">
              {shortenAddress(address)}
            </span>
          </p>
        );
      case "Status":
        return (
          <div className="h-[30px] w-auto px-4 bg-[#C4FFA2] rounded-xl flex items-center justify-center">
            <h1 className="text-[#115E2C] font-light text-[12px] leading-[19px]">
              Verified
            </h1>
          </div>
        );
      case "Registered events":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{0}</span> events
          </h1>
        );
      case "Marked attendance":
        return (
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">{0}</span> marked
            </h1>
            <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
              <span className="text-[#9B51E0]">{0}</span> unmarked
            </h1>
          </div>
        );
      case "Certifications":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{certCount}</span> Certifications
          </h1>
        );
      case "Courses":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{completedCourses}</span> courses
          </h1>
        );
      case "Course Certification":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{ongoingCourses}</span> Course
            Certification
          </h1>
        );
      case "Event Certification":
        return (
          <h1 className="text-[12px] font-medium leading-[16px] text-[#817676]">
            <span className="text-[#9B51E0]">{eventCerts}</span> Event
            Certification
          </h1>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
        {/* Left Column - Overview Section */}
        <div className="hidden sm:block row-span-2 bg-white rounded-lg mb-6 py-5 border border-[#b9b9ba]">
          <div className="border-b-2 border-[#b9b9ba]">
            <div className="flex gap-2 w-auto rounded-xl mx-12 items-center border-[1px] border-[#6B6D6E] p-3 mb-3">
              <Image src={item.img} alt="img" className="mr-2" />
              <h1 className="text-[14px]">{item.name} Overview</h1>
            </div>
          </div>

          <div className="mx-12 mt-3">
            {item.subProp.map((prop, i) => (
              <div key={i} className="flex space-x-4 items-center py-2">
                <div className="flex items-center space-x-3 my-2 w-[250px]">
                  <SlExclamation className="text-[#2D3A4B] h-[12px] w-[12px]" />
                  <p className="text-[14px] font-medium text-[#333333] leading-[22px]">
                    {prop}:
                  </p>
                </div>
                {renderContent(prop)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Events Table */}
        <div className="row-span-2 bg-white rounded-lg mb-6 py-5 border border-[#b9b9ba] overflow-hidden">
          <div className="border-b-2 border-[#b9b9ba]">
            <div className="flex justify-between items-center content-center px-8 py-3">
              <div className="border-[1px] border-[#6B6D6E] px-4 mb-3 rounded-xl">
                <h1 className="text-[14px]">{item.viewPartName}</h1>
              </div>
              {item.eventsData.length === 0 ? (
                <Image src={up} alt="up" />
              ) : (
                <Image src={down} alt="down" />
              )}
            </div>
          </div>

          <div className="min-h-[308px] w-full overflow-x-auto">
            {item.eventsData.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-full">
                      <thead>
                        <tr className="w-full h-[42px] border-b-2 border-black font-normal text-[#2d3a4b] leading-[19.79px]">
                          {item.heading.map((heading, index) => (
                            <th
                              key={index}
                              className={`py-3 px-4 sm:px-6 border-b-2 border-[#b9b9ba] text-[12px] h-[42px] min-w-0 ${
                                index === 0
                                  ? "text-left w-[35%] sm:w-[40%]"
                                  : "text-center w-[21.67%] sm:w-[20%]"
                              }`}
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.eventsData
                          .slice((currentPage - 1) * 6, currentPage * 6)
                          .map((data, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 h-[60px] border-b-2 border-[#b9b9ba]"
                            >
                              <td className="py-3 px-4 sm:px-6 truncate h-[60px] min-w-0">
                                <span className="text-[14px] text-[#333333]">
                                  {data.eventName}
                                </span>
                              </td>
                              {hasStatusData && (
                                <td className="py-3 px-4 sm:px-6 whitespace-nowrap h-[60px] min-w-0">
                                  <div
                                    className={`inline-flex p-2 rounded-lg text-xs items-center justify-center ${
                                      data.status === "Course Complete"
                                        ? "bg-[#C4FFA2] text-[#115E2C]"
                                        : "bg-[#F6A61C2B] text-[#730404]"
                                    }`}
                                  >
                                    {data.status}
                                  </div>
                                </td>
                              )}
                              {hasCertificationData && (
                                <td className="py-3 px-4 sm:px-6 whitespace-nowrap h-[60px] min-w-0">
                                  <div className="flex items-center justify-center h-full">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="text-[#5801A9] cursor-pointer"
                                        onClick={() =>
                                          handleImageClick(data.nftImg)
                                        }
                                      >
                                        {data.certification}
                                      </span>
                                      {data.nftImg && (
                                        <Image
                                          src={data.nftImg}
                                          alt="nftImg"
                                          width={24}
                                          height={24}
                                          className="object-contain cursor-pointer"
                                          onClick={() =>
                                            handleImageClick(data.nftImg)
                                          }
                                        />
                                      )}
                                    </div>
                                  </div>
                                </td>
                              )}
                              <td className="py-3 px-4 sm:px-6 text-center truncate h-[60px] min-w-0">
                                <span className="text-[14px] text-[#333333]">
                                  {(() => {
                                    // Try to match the course based on blockchain data
                                    let matchedCourseId = null;
                                    let matchedDate = null;

                                    // Get all courses info from blockchain (this should be available from the useEffect)
                                    // For now, we'll use the certificationDates mapping which contains the real dates
                                    const availableCourseIds =
                                      Object.keys(certificationDates).map(
                                        Number,
                                      );

                                    // Try to match based on course data
                                    let tableCourseId = null;

                                    // Try different possible locations for course identifier
                                    if (data.data?.course_identifier) {
                                      tableCourseId = parseInt(
                                        data.data.course_identifier,
                                        10,
                                      );
                                    } else if (data.data?.courseIdentifier) {
                                      tableCourseId = parseInt(
                                        data.data.courseIdentifier,
                                        10,
                                      );
                                    } else if (data.courseIdentifier) {
                                      tableCourseId = parseInt(
                                        String(data.courseIdentifier),
                                        10,
                                      );
                                    } else if (data.data?.id) {
                                      tableCourseId = parseInt(
                                        String(data.data.id),
                                        10,
                                      );
                                    }

                                    if (
                                      tableCourseId &&
                                      !isNaN(tableCourseId)
                                    ) {
                                      // Check if this course ID exists in our blockchain data
                                      if (
                                        availableCourseIds.includes(
                                          tableCourseId,
                                        )
                                      ) {
                                        matchedCourseId = tableCourseId;
                                        matchedDate =
                                          certificationDates[tableCourseId];
                                      }
                                    } else {
                                      // If no direct match, try to find by other criteria
                                      if (
                                        !matchedDate &&
                                        data.type === "CERT_CLAIMED"
                                      ) {
                                        // For certification events, try to find the most recent certification
                                        const certEvents = Object.entries(
                                          certificationDates,
                                        )
                                          .filter(([courseId, date]) => {
                                            // You might need to add more sophisticated matching logic here
                                            // based on your specific data structure
                                            return true; // For now, return all certification dates
                                          })
                                          .sort(
                                            (a, b) =>
                                              new Date(b[1]).getTime() -
                                              new Date(a[1]).getTime(),
                                          );

                                        if (certEvents.length > 0) {
                                          const [courseId, date] =
                                            certEvents[0];
                                          matchedCourseId = parseInt(
                                            courseId,
                                            10,
                                          );
                                          matchedDate = date;
                                        }
                                      }
                                    }

                                    if (matchedDate) {
                                      return matchedDate;
                                    }

                                    // Fallback to original date
                                    return data.date;
                                  })()}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4 h-auto min-h-[308px] overflow-y-auto">
                  {item.eventsData
                    .slice((currentPage - 1) * 6, currentPage * 6)
                    .map((data, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-[#b9b9ba]"
                      >
                        <div className="px-6 py-4 border-b border-[#b9b9ba]">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[14px] text-[#333333] font-medium pr-2">
                              {data.eventName}
                            </h3>
                            {hasStatusData && (
                              <div
                                className={`inline-flex p-2 rounded-lg text-xs items-center justify-center shrink-0 ${
                                  data.status === "Course Complete"
                                    ? "bg-[#C4FFA2] text-[#115E2C]"
                                    : "bg-[#F6A61C2B] text-[#730404]"
                                }`}
                              >
                                {data.status}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            {hasCertificationData && (
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[#5801A9] text-sm cursor-pointer"
                                  onClick={() => handleImageClick(data.nftImg)}
                                >
                                  {data.certification}
                                </span>
                                {data.nftImg && (
                                  <Image
                                    src={data.nftImg}
                                    alt="nftImg"
                                    width={24}
                                    height={24}
                                    className="object-contain cursor-pointer"
                                    onClick={() =>
                                      handleImageClick(data.nftImg)
                                    }
                                  />
                                )}
                              </div>
                            )}
                            <span className="text-[12px] text-[#333333]">
                              {data.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center min-h-[200px]">
                <h1 className="text-[15px] text-[#817676] font-medium leading-[18px] text-center">
                  This address has no event data
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-xl max-w-4xl w-full">
            <button
              onClick={handleCloseOverlay}
              className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <IoClose className="w-5 h-5 text-gray-600" />
            </button>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Section */}
                <div className="flex-1">
                  <Image
                    src={selectedImage}
                    alt="Certificate"
                    width={600}
                    height={400}
                    className="object-contain rounded-lg shadow-lg w-full h-full"
                  />
                </div>

                {/* Course Information Section */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Certificate Details
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      This {shortenAddress(address)} has been certified for
                      taking{" "}
                      <span className="text-[#4A90E2] font-medium">
                        {(() => {
                          const event = item.eventsData.find(
                            (event) => event.nftImg === selectedImage,
                          );
                          return event?.eventName === "Certificate Claimed"
                            ? "the course"
                            : event?.eventName;
                        })()}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-block w-2 h-2 bg-[#C4FFA2] rounded-full"></span>
                      <span>Certificate Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultGrid;
