import React, { useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Image from "next/image";
import play from "@/assets/play.svg";
import tdesign_video from "@/assets/tdesign_video.svg";
import { useRouter } from "next/navigation";
import { handleCourse } from "@/utils/helpers";
import {
  getWatchedLectures,
  calculateCourseStats,
  generateCourseId,
  debugCourseProgress,
} from "@/utils/courseProgress";

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
  item: ItemProps;
  selected: string;
  takenCoursesData: any;
}

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
  const estimatedDurationSeconds = (fileSize * 8) / estimatedBitrate;
  return Math.round(estimatedDurationSeconds);
}

const LearningJourney: React.FC<LearningJourneyProps> = ({
  item,
  selected,
  takenCoursesData,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [watchedLectures, setWatchedLectures] = useState<{
    [courseId: string]: string[];
  }>({});

  console.log("watchedLectures", watchedLectures);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(takenCoursesData.length / itemsPerPage);

  // Get current page items
  const currentItems = takenCoursesData
    ?.slice()
    .reverse()
    ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Load watched lectures from localStorage on component mount and when window gains focus
  useEffect(() => {
    const loadWatchedLectures = () => {
      console.log(
        "[LearningJourney] loadWatchedLectures - currentItems:",
        currentItems,
      );
      const watched: { [courseId: string]: string[] } = {};
      currentItems.forEach((item: any) => {
        console.log("[LearningJourney] Processing item:", item);
        const courseId =
          item.course_identifier?.toString() || item.data?.courseName || "";
        console.log("[LearningJourney] Generated courseId:", courseId);
        watched[courseId] = getWatchedLectures(item);
        console.log(
          "[LearningJourney] Watched lectures for this course:",
          watched[courseId],
        );
      });
      setWatchedLectures(watched);
      console.log("Loaded watched lectures:", watched);
    };

    // Load on mount
    console.log("[LearningJourney] Loading watched lectures on mount");
    loadWatchedLectures();

    // Listen for window focus events to refresh data when user returns from watching videos
    const handleFocus = () => {
      console.log("Window focused, refreshing watched lectures");
      loadWatchedLectures();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [takenCoursesData]); // Only depend on the actual data, not the paginated items

  // Function to calculate completion stats for a course
  const getCourseCompletionStats = (item: any) => {
    console.log("[LearningJourney] getCourseCompletionStats - item:", item);
    console.log(
      "[LearningJourney] getCourseCompletionStats - item type:",
      typeof item,
    );
    console.log(
      "[LearningJourney] getCourseCompletionStats - item keys:",
      Object.keys(item || {}),
    );

    // Debug: Check what's in localStorage for this course
    const testCourseId =
      item.course_identifier?.toString() || item.data?.courseName || "";
    console.log(
      "[LearningJourney] Testing localStorage for courseId:",
      testCourseId,
    );
    const testWatched = localStorage.getItem(
      `watched_lectures_${testCourseId}`,
    );
    console.log("[LearningJourney] localStorage content:", testWatched);

    const courseId =
      item.course_identifier?.toString() || item.data?.courseName || "";
    console.log(
      "[LearningJourney] getCourseCompletionStats - courseId:",
      courseId,
    );
    const watched = watchedLectures[courseId] || [];
    console.log(
      "[LearningJourney] getCourseCompletionStats - watched:",
      watched,
    );
    const stats = calculateCourseStats(item, watched);
    console.log("[LearningJourney] getCourseCompletionStats - stats:", stats);
    return stats;
  };

  if (takenCoursesData.length == 0) {
    return <div className="text-[#A01B9B] text-center mt-12">No Courses</div>;
  }

  return (
    <div className="bg-white sm:my-12 rounded-xl border-[1px] border-[#BCBCBC] h-auto pb-8">
      <div>
        {item.no == 1 ? (
          <div className="flex justify-between  border-b-[1px] border-b-[#CACBCB] my-3 px-10">
            <div className="flex text-gradient-to-r from-purple-400 via-purple-30 mx-8 my-5">
              <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
            </div>
          </div>
        ) : null}

        <div>
          <div className="block justify-top">
            {currentItems?.map((item: any, index: number) => {
              const stats = getCourseCompletionStats(item);

              return (
                <div
                  key={index}
                  className="px-5 xl:px-12 flex border-top py-6 border-2 gap-6 xl:gap-0 flex-col w-full xl:flex-row xl:space-x-8 items-start"
                >
                  {/* Course Image */}
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
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div
                          onClick={(e) => {
                            localStorage.setItem(
                              "courseData",
                              JSON.stringify(item?.data),
                            );
                            handleCourse(
                              e,
                              e.currentTarget.textContent,
                              router,
                              item?.course_identifier,
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <h3 className="text-lg font-semibold text-[#2D3A4B] mb-2 hover:text-[#A01B9B] transition-colors">
                            {item.data.courseName}
                          </h3>
                        </div>
                        <div
                          onClick={(e) => {
                            localStorage.setItem(
                              "courseData",
                              JSON.stringify(item?.data),
                            );
                            handleCourse(
                              e,
                              e.currentTarget.textContent,
                              router,
                              item?.course_identifier,
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <p className="text-sm text-[#6B7280] mb-3 line-clamp-2 hover:text-[#A01B9B] transition-colors">
                            {item.data.courseDescription}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap xl:flex-nowrap gap-y-2 gap-4 xl:gap-0 items-center my-3 ">
                      <div className="flex items-center gap-2">
                        <Image src={play} alt="" height={12} width={12} />
                        <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                          Total play time:{" "}
                          {formatDuration(stats.totalCourseTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="hidden sm:block ml-2">|</p>
                        <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                          Created by:{" "}
                          <span className="underline">
                            {item.data.courseCreator}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="my-3">
                      <ProgressBar
                        completed={stats.progressPercentage.toString()}
                        height="13px"
                        bgColor="#9B51E0"
                      />
                    </div>

                    <div className="my-3 flex justify-between">
                      <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                        {stats.completedLectures}/{stats.totalLectures} Lectures
                        completed
                      </p>
                      <p className="underline text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                        ({formatDuration(stats.totalWatchedTime)})
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
                onClick={() => typeof page === "number" && goToPage(page)}
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
