import React, { useState, useEffect, useMemo } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Image from "next/image";
import play from "@/assets/play.svg";
import tdesign_video from "@/assets/tdesign_video.svg";
import { useRouter } from "next/navigation";
import { handleCourse } from "@/utils/helpers";

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

// Helper function to get user's watched lectures from localStorage
function getWatchedLectures(courseId: string): string[] {
  if (typeof window === "undefined") return [];
  const watched = localStorage.getItem(`watched_lectures_${courseId}`);
  return watched ? JSON.parse(watched) : [];
}

// Helper function to mark a lecture as watched
function markLectureAsWatched(courseId: string, lectureName: string) {
  if (typeof window === "undefined") return;
  const watched = getWatchedLectures(courseId);
  if (!watched.includes(lectureName)) {
    watched.push(lectureName);
    localStorage.setItem(
      `watched_lectures_${courseId}`,
      JSON.stringify(watched),
    );
  }
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

  // Get current page items - memoized to prevent unnecessary recalculations
  const currentItems = useMemo(() => {
    return takenCoursesData?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [takenCoursesData, currentPage, itemsPerPage]);

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

  // Load watched lectures from localStorage on component mount
  useEffect(() => {
    const watched: { [courseId: string]: string[] } = {};
    currentItems.forEach((item: any) => {
      const courseId =
        item.course_identifier?.toString() || item.data?.courseName || "";
      watched[courseId] = getWatchedLectures(courseId);
      console.log("watched", watched);
    });
    setWatchedLectures(watched);
  }, [takenCoursesData]); // Only depend on the actual data, not the paginated items

  // Function to calculate completion stats for a course
  const getCourseCompletionStats = (item: any) => {
    const courseId =
      item.course_identifier?.toString() || item.data?.courseName || "";
    const curriculum = item.data?.courseCurriculum || [];
    const totalLectures = curriculum.length;
    const watched = watchedLectures[courseId] || [];
    const completedLectures = watched.length;

    // Calculate total watched time
    const totalWatchedTime = curriculum
      .filter((lecture: any) => watched.includes(lecture.name))
      .reduce(
        (sum: number, lecture: any) =>
          sum + estimateVideoDuration(lecture.fileSize || 0),
        0,
      );

    // Calculate total course time
    const totalCourseTime = curriculum.reduce(
      (sum: number, lecture: any) =>
        sum + estimateVideoDuration(lecture.fileSize || 0),
      0,
    );

    const progressPercentage =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    return {
      totalLectures,
      completedLectures,
      progressPercentage,
      totalWatchedTime,
      totalCourseTime,
    };
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
            {/* <div className="hidden sm:flex mx-8 my-5">
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
            </div> */}
          </div>
        ) : null}

        <div>
          <div className="block justify-top">
            {currentItems
              ?.slice()
              .reverse()
              .map((item: any, index: number) => {
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
                          <h3 className="text-lg font-semibold text-[#2D3A4B] mb-2">
                            {item.data.courseName}
                          </h3>
                          <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
                            {item.data.courseDescription}
                          </p>
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
                          <p className="hidden sm:block">|</p>
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
                          {stats.completedLectures}/{stats.totalLectures}{" "}
                          Lectures completed
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
