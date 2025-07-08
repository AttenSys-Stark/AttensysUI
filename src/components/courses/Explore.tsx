import React, { useEffect, useMemo, useState } from "react";

import videoHero from "../../assets/video.svg";
import CarouselComp from "./Carousel";
import Image from "next/image";
import { GiBackwardTime } from "@react-icons/all-files/gi/GiBackwardTime";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { useRouter } from "next/navigation";
import { handleCourse } from "@/utils/helpers";
import { skills } from "@/constants/data";
import "react-multi-carousel/lib/styles.css";
import StarRating from "../bootcamp/StarRating";
import { LuBadgeCheck } from "react-icons/lu";
import ReactPlayer from "react-player";
import { PinataSDK } from "pinata";
import { split } from "lodash-es";
import { getAverageRatingForVideo } from "@/lib/services/reviewService";
import { RatingDisplay } from "@/components/RatingDisplay";
import {
  getCoursesLastUpdated,
  formatLastUpdated,
  getLastUpdateDescription,
  getFallbackDate,
  CourseLastUpdated,
} from "@/utils/courseLastUpdated";

// Helper function to format duration
function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return (
    [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null, s > 0 ? `${s}s` : null]
      .filter(Boolean)
      .join(" ") || "0s"
  );
}

// Helper function to estimate video duration from file size
function estimateVideoDuration(fileSize: number): number {
  // Estimate based on average video bitrate (assuming 1 Mbps for compressed video)
  // This is a rough estimate - actual duration may vary
  const estimatedBitrate = 1000000; // 1 Mbps in bits per second
  const fileSizeInBits = fileSize * 8; // Convert bytes to bits
  return Math.floor(fileSizeInBits / estimatedBitrate);
}

interface ChildComponentProps {
  wallet: any;
  courseData: any;
  querystat: any;
  unfilteredData: any;
}

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

function extractCIDFromUrl(ipfsUrl: string): string {
  const parts = ipfsUrl.split("/");
  const cid = parts[parts.length - 1];
  return cid.split("?")[0].split(".")[0];
}

async function createAccess(cid: string, expires: number = 86400) {
  try {
    const formattedCid = extractCIDFromUrl(cid);
    const accessUrl = await pinata.gateways.private.createAccessLink({
      cid: formattedCid,
      expires,
    });
    return accessUrl;
  } catch (err) {
    console.error("Error creating access link:", err);
  }
}

const Explore = ({
  wallet,
  courseData,
  querystat,
  unfilteredData,
}: ChildComponentProps) => {
  const router = useRouter();
  const featuredCourse = courseData[courseData.length - 1];
  const [currentPage, setCurrentPage] = useState(1);
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});

  const itemsPerPage = 8;
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [courseData]);
  const clearSearch = () => {
    router.push("/Course");
  };
  // Calculate pagination values
  const { currentItems, totalPages } = useMemo(() => {
    const totalItems = Array.isArray(courseData) ? courseData.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const currentItems = Array.isArray(courseData)
      ? courseData.slice(startIndex, endIndex)
      : [];

    return { currentItems, totalPages };
  }, [courseData, currentPage]);

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

  // Store average ratings for each course by identifier
  const [averageRatings, setAverageRatings] = useState<{ [key: string]: any }>(
    {},
  );

  // Store last updated timestamps for each course
  const [coursesLastUpdated, setCoursesLastUpdated] = useState<{
    [key: number]: CourseLastUpdated;
  }>({});
  const [isLoadingLastUpdated, setIsLoadingLastUpdated] = useState(false);

  useEffect(() => {
    // Fetch average ratings for all currentItems when courseData or currentPage changes
    const fetchAllRatings = async () => {
      const ratings: { [key: string]: any } = {};
      if (Array.isArray(courseData)) {
        await Promise.all(
          courseData.map(async (course: any) => {
            const identifier = course?.course_identifier;
            if (identifier && !(identifier in ratings)) {
              const avg = await getAverageRatingForVideo(
                (course?.data?.courseName?.toString() ?? "") + identifier,
              );
              ratings[identifier] = avg;
            }
          }),
        );
      }
      setAverageRatings(ratings);
    };
    fetchAllRatings();
  }, [courseData, currentPage]);

  // Fetch last updated timestamps for courses
  useEffect(() => {
    const fetchLastUpdated = async () => {
      if (wallet?.address && courseData && courseData.length > 0) {
        try {
          setIsLoadingLastUpdated(true);
          const courseIdentifiers = courseData.map(
            (course: any) => course.course_identifier,
          );
          const lastUpdatedData = await getCoursesLastUpdated(
            courseIdentifiers,
            wallet.address,
          );

          // Convert array to object for easier lookup
          const lastUpdatedMap: { [key: number]: CourseLastUpdated } = {};
          lastUpdatedData.forEach((item) => {
            lastUpdatedMap[item.courseIdentifier] = item;
          });

          setCoursesLastUpdated(lastUpdatedMap);
        } catch (error) {
          console.error("Error fetching course last updated data:", error);
        } finally {
          setIsLoadingLastUpdated(false);
        }
      }
    };

    fetchLastUpdated();
  }, [wallet?.address, courseData]);
  // console.log("Average Ratings:", averageRatings);

  const renderCourseCard = (course: any, index: any) => {
    const averageRating = averageRatings[course?.course_identifier];
    return (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      >
        <div className="h-48 relative">
          <Image
            src={`https://ipfs.io/ipfs/${course?.data?.courseImage}`}
            alt={course?.data?.courseName || "Course image"}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <p className="bg-[#5801A9] text-white text-[10px] px-2 py-1 rounded">
              {course?.data?.difficultyLevel || "Beginner"}
            </p>
            <div className="flex items-center">
              {/* <StarRating totalStars={5} starnumber={4} /> */}
              <RatingDisplay rating={averageRating} size="xs" />
            </div>
          </div>

          <h3
            className="font-bold text-lg mb-2 cursor-pointer hover:text-[#5801A9]"
            onClick={(e) => {
              localStorage.setItem(
                `courseData_${course?.course_identifier}`,
                JSON.stringify(course?.data),
              );
              handleCourse(
                e,
                e.currentTarget.textContent,
                router,
                course?.course_identifier,
              );
            }}
          >
            {course?.data.courseName.slice(0, 23) +
              (course?.data.courseName.length > 23 ? "..." : "") ||
              "Course Title"}
          </h3>

          <div
            className="text-gray-600 text-sm mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html:
                course?.data?.courseDescription || "No description available",
            }}
          />

          <div className="flex items-center text-xs text-gray-500">
            <GrDiamond className="mr-1" />
            <span>By {course?.data?.courseCreator || "Unknown Creator"}</span>
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={(e) => {
              localStorage.setItem(
                `courseData_${course?.course_identifier}`,
                JSON.stringify(course?.data),
              );
              handleCourse(
                e,
                e.currentTarget.textContent,
                router,
                course?.course_identifier,
              );
            }}
            className="w-full bg-[#5801A9] hover:bg-[#4a0189] text-white py-2 rounded text-sm font-medium"
          >
            View Course
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Pre-fetch all video URLs when component mounts or courseData changes
    const fetchUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const item of unfilteredData[unfilteredData.length - 1]?.data
        .courseCurriculum || []) {
        try {
          const url = await createAccess(item.video);
          if (url) {
            urls[item.video] = url;
          }
        } catch (error) {
          console.error(`Error fetching URL for ${item.video}:`, error);
        }
      }
      setVideoUrls(urls);
    };

    fetchUrls();
  }, [courseData, createAccess]);

  return (
    <div>
      {/* Hero section */}
      <div className="bg-[url('/hero_asset.png')] space-y-4 text-white px-8 lg:px-28 py-10 lg:py-20 h-80 flex items-center">
        <div className="w-full mx-auto max-w-screen-2xl">
          <h1 className="w-[90%] xl:w-5/12 font-bold text-2xl sm:text-4xl mb-4">
            Continuous learning is the key to success - upskill with us
          </h1>
          <p className="w-[90%] sm:w-1/2">
            With Attensys, all you need is your address to prove your
            certification. Welcome to the future{" "}
          </p>
        </div>
      </div>

      {/* Skills tags */}
      <div className="ml-6 lg:mx-12 overflow-x-scroll xl:overflow-auto my-16 hidden xl:flex flex-row space-x-4 lg:justify-center">
        {skills.map((item, index) => (
          <p
            className="bg-[#2D3A4B] px-6 py-3.5 rounded-lg text-white flex flex-none items-center justify-center"
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

      {querystat && courseData.length === 0 ? (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any courses matching &quot;{querystat}
              &quot;. Try different keywords or browse all available courses.
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white rounded-lg hover:opacity-90"
            >
              View All Courses
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-6 lg:mx-auto max-w-screen-2xl my-8">
          {courseData.length > 0 ? (
            <>
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold text-[#2D3A4B] mb-6">
                  {courseData.length} Course{courseData.length !== 1 ? "s" : ""}{" "}
                  Available
                </h2>
                {querystat && (
                  <p
                    onClick={clearSearch}
                    className="text-[20px] text-end text-blue-500 underline cursor-pointer"
                  >
                    view all courses
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((course: any, index: any) =>
                  renderCourseCard(course, index),
                )}
              </div>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No courses found. Try different search terms.
              </p>
            </div>
          )}
        </div>
      )}

      {/* What to learn next */}
      <div className="mx-6 lg:mx-auto">
        <div className="mx-auto max-w-screen-2xl">
          <div className="my-4">
            <h3 className="text-[25px] font-bold text-[#2D3A4B]">
              What to learn next
            </h3>
            <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
              Because you viewed{" "}
              <span className="text-[#5801A9] font-bold underline">
                &ldquo;Introduction to Web Dev Starknet&rdquo;
              </span>
            </p>
          </div>

          <CarouselComp wallet={wallet} averagereviewrating={averageRatings} />
        </div>

        {/* Featured section */}
        <div className="sm:px-6 lg:mx-auto max-w-screen-2xl flex flex-col w-full lg:flex-row gap-6 justify-between my-6 sm:my-24">
          <div className="my-4 lg:hidden">
            <h3 className="text-[25px] font-bold text-[#2D3A4B]">
              Fan favorite
            </h3>
            <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
              Because you viewed{" "}
              <span className="text-[#5801A9] font-bold underline">
                &ldquo;Introduction to Web Dev Starknet&rdquo;
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-5 xl:w-[70%]">
            <div className="h-full w-full rounded-xl">
              <Image
                src={`https://ipfs.io/ipfs/${unfilteredData[unfilteredData.length - 1]?.data?.courseImage}`}
                alt="video"
                width={700}
                height={700}
                className="object-cover h-full w-full rounded-xl"
              />
            </div>

            <div className="my-4 sm:my-0 lg:ml-8">
              <div>
                <div
                  onClick={(e) => {
                    localStorage.setItem(
                      `courseData_${unfilteredData[unfilteredData.length - 1]?.course_identifier}`,
                      JSON.stringify(
                        unfilteredData[unfilteredData.length - 1]?.data,
                      ),
                    );
                    handleCourse(
                      e,
                      e.currentTarget.textContent,
                      router,
                      unfilteredData[unfilteredData.length - 1]
                        ?.course_identifier,
                    );
                  }}
                >
                  <button className="bg-[#2D3A4B] hidden lg:block hover:bg-gray-500 text-white text-[11px] font-bold py-2 px-4 rounded cursor-pointer">
                    Get this course
                  </button>
                  <h2 className="font-bold lg:text-[32px] text-[23px] sm:text-4xl text-[#2D3A4B] my-4 cursor-pointer">
                    {unfilteredData[unfilteredData.length - 1]?.data.courseName}
                  </h2>
                </div>
                <p className="text-white font-semibold inline gap-2 text-sm bg-[#5801A9] rounded p-2">
                  {
                    unfilteredData[unfilteredData.length - 1]?.data
                      .courseCreator
                  }
                </p>
                <button
                  onClick={(e) => {
                    localStorage.setItem(
                      `courseData_${unfilteredData[unfilteredData.length - 1]?.course_identifier}`,
                      JSON.stringify(
                        unfilteredData[unfilteredData.length - 1]?.data,
                      ),
                    );
                    handleCourse(
                      e,
                      e.currentTarget.textContent,
                      router,
                      unfilteredData[unfilteredData.length - 1]
                        ?.course_identifier,
                    );
                  }}
                  className="bg-[#5801a9] ml-3 lg:hidden hover:bg-gray-500 text-white gap-2 text-[14px] rounded-md font-bold p-2 cursor-pointer"
                >
                  Get this course
                </button>

                <div className="flex flex-col sm:flex-row space-x-28 sm:gap-x-4 items-start justify-start my-4">
                  <div className="flex items-center space-x-4">
                    {/* <StarRating totalStars={5} starnumber={4} />
                    <p className="font-bold text-[13px] text-[#2D3A4B]">
                      (281)
                    </p> */}
                    <RatingDisplay
                      rating={
                        averageRatings[
                          unfilteredData[unfilteredData.length - 1]
                            ?.course_identifier
                        ]
                      }
                      size="sm"
                    />
                  </div>
                  {/* <div className="flex items-center mt-3 sm:mt-0">
                    <LuBadgeCheck color="#2D3A4B" />
                    <p className="font-bold text-[13px] text-[#2D3A4B] ml-1">
                      291 certification
                    </p>
                  </div> */}
                </div>

                <div className="flex flex-row flex-wrap sm:flex-row sm:flex-wrap gap-y-3 gap-x-4 lg:gap-x-6">
                  <p className="text-[11px] text-[#2D3A4B] font-medium">
                    Created by:{" "}
                    <span className="underline inline">
                      {
                        unfilteredData[unfilteredData.length - 1]?.data
                          .courseCreator
                      }
                    </span>
                  </p>
                  <span className="flex gap-2 items-center">
                    <GiBackwardTime />
                    <p className="text-[11px] text-[#2D3A4B] font-medium">
                      {(() => {
                        if (isLoadingLastUpdated) {
                          return "Loading...";
                        }
                        const featuredCourseId =
                          unfilteredData[unfilteredData.length - 1]
                            ?.course_identifier;
                        const lastUpdated =
                          coursesLastUpdated[featuredCourseId];
                        if (lastUpdated) {
                          const formattedDate = formatLastUpdated(
                            lastUpdated.lastUpdated,
                          );
                          const description = getLastUpdateDescription(
                            lastUpdated.eventType,
                          );
                          return `${description} ${formattedDate}`;
                        }
                        return `Last updated ${getFallbackDate()}`; // Fallback
                      })()}
                    </p>
                  </span>
                  <span className="flex gap-2 items-center">
                    <FaPlay className="text-[#5801A9]" />
                    <p className="text-[11px] text-[#2D3A4B] font-medium">
                      Total play time:{" "}
                      {(() => {
                        const totalPlayTime =
                          unfilteredData[
                            unfilteredData.length - 1
                          ]?.data?.courseCurriculum?.reduce(
                            (sum: number, lecture: any) =>
                              sum +
                              estimateVideoDuration(lecture.fileSize || 0),
                            0,
                          ) || 0;
                        return formatDuration(totalPlayTime);
                      })()}
                    </p>
                  </span>
                  <span className="flex gap-2 items-center">
                    <GrDiamond className="text-[#2D3A4B]" />
                    <p className="text-[11px] text-[#2D3A4B] font-medium">
                      Difficulty level:{" "}
                      {
                        unfilteredData[unfilteredData.length - 1]?.data
                          .difficultyLevel
                      }
                    </p>
                  </span>
                  <span className="flex items-center gap-2">
                    <LuBadgeCheck className="text-[#5801A9]" />
                    <p className="text-[11px] text-[#2D3A4B] font-medium">
                      Certificate of Completion
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lectures */}
          <div className="hidden xl:block w-[32%] h-[307px] overflow-y-scroll">
            <div className="flex justify-between border-b-2 pb-3">
              <h4>
                Lectures (
                {
                  unfilteredData[unfilteredData.length - 1]?.data
                    .courseCurriculum.length
                }
                )
              </h4>
              <IoMdArrowDropdown />
            </div>
            <div>
              {unfilteredData[unfilteredData.length - 1]?.data.courseCurriculum
                ?.slice()
                .reverse()
                ?.map((item: any, i: any) => {
                  return (
                    <div
                      key={i}
                      className="flex content-center text-sm my-3 cursor-pointer space-x-4"
                      // onClick={(e) => {
                      //   localStorage.setItem(
                      //     `courseData_${unfilteredData[unfilteredData.length - 1]?.course_identifier}`,
                      //     JSON.stringify(
                      //       unfilteredData[unfilteredData.length - 1]?.data,
                      //     ),
                      //   );
                      //   handleCourse(
                      //     e,
                      //     e.currentTarget.textContent,
                      //     router,
                      //     unfilteredData[unfilteredData.length - 1]
                      //       ?.course_identifier,
                      //   );
                      // }}
                    >
                      <div
                        className="w-[150px] h-[90px] rounded-xl border-4 border flex-shrink-0 overflow-hidden"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {videoUrls[item.video] && (
                          <ReactPlayer
                            url={videoUrls[item.video]}
                            controls={false}
                            playing={false}
                            width="100%"
                            height="100%"
                            playIcon={<></>}
                          />
                        )}
                      </div>

                      <div className="w-[230px]">
                        <h6 className="font-bold">
                          {item.name}
                          {/* <span className="text-[#5801A9]">({item.time})</span> */}
                        </h6>
                        <p className="font-light mt-2">
                          {item.description.slice(0, 75)}...
                        </p>
                      </div>
                    </div>
                  );

                  //   <LectureCard
                  //   key={i}
                  //   item={item}
                  //   courseData={courseData}
                  //   router={router}
                  //   createAccess={createAccess}
                  // />
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 p-4 sm:p-8 my-4">
          <div className="mx-auto max-w-screen-2xl">
            <p className="text-white font-light text-sm sm:text-base sm:font-bold lg:ml-24">
              Recommended to you based on rating
            </p>
          </div>
        </div>

        <div className="mx-6 lg:mx-auto max-w-screen-2xl">
          <CarouselComp wallet={wallet} averagereviewrating={averageRatings} />
          <div className="mt-8 sm:mt-24">
            <div className="my-4">
              <h3 className="text-2xl font-bold">You will love this</h3>
              <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
                Because you viewed{" "}
                <span className="text-[#5801A9] font-bold">
                  &ldquo;Introduction to Web Dev Starknet&rdquo;
                </span>
              </p>
            </div>
            <CarouselComp
              wallet={wallet}
              averagereviewrating={averageRatings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
