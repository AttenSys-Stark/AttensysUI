import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { Package } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { api, Course } from "@/services/api";

interface EventItem {
  id: string;
  message: string;
  blockNumber: number;
  timestamp: string;
  type: string;
}

interface CourseDetails {
  [key: number]: string; // courseIdentifier -> courseName
}

const eventFetchers = [
  { fn: api.getCreatedCourses, type: "CourseCreated" },
  { fn: api.getReplacedCourses, type: "CourseReplaced" },
  { fn: api.getCertClaimedCourses, type: "CourseCertClaimed" },
  { fn: api.getAdminTransferredCourses, type: "AdminTransferred" },
  { fn: api.getAcquiredCourses, type: "AcquiredCourse" },
  { fn: api.getSuspendedCourses, type: "CourseSuspended" },
  { fn: api.getUnsuspendedCourses, type: "CourseUnsuspended" },
  { fn: api.getRemovedCourses, type: "CourseRemoved" },
  { fn: api.getPriceUpdatedCourses, type: "CoursePriceUpdated" },
  { fn: api.getApprovedCourses, type: "CourseApproved" },
  { fn: api.getUnapprovedCourses, type: "CourseUnapproved" },
];

const EventFeed = () => {
  const feedRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({});
  const itemsPerPage = 15;

  // Fetch all event types in parallel using useQueries
  const queries = useQueries({
    queries: eventFetchers.map((fetcher) => ({
      queryKey: [fetcher.type],
      queryFn: async () => {
        try {
          const data = await fetcher.fn();
          console.log(`Fetched ${fetcher.type}:`, data);
          return data;
        } catch (error) {
          console.error(`Error fetching ${fetcher.type}:`, error);
          return [];
        }
      },
      refetchInterval: 10000, // Refetch every 10 seconds
    })),
  });

  // Function to fetch course details by identifier
  const fetchCourseDetails = async (
    courseIdentifier: number,
  ): Promise<string> => {
    if (courseDetails[courseIdentifier]) {
      return courseDetails[courseIdentifier];
    }

    try {
      const course = await api.getCourseByIdentifier(
        courseIdentifier.toString(),
      );
      const courseName = course.name || `Course #${courseIdentifier}`;

      // Cache the result
      setCourseDetails((prev) => ({
        ...prev,
        [courseIdentifier]: courseName,
      }));

      return courseName;
    } catch (error) {
      console.error(
        `Error fetching course details for ${courseIdentifier}:`,
        error,
      );
      return `Course #${courseIdentifier}`;
    }
  };

  // Function to get course name (with caching)
  const getCourseName = async (courseIdentifier: number): Promise<string> => {
    if (courseDetails[courseIdentifier]) {
      return courseDetails[courseIdentifier];
    }
    return await fetchCourseDetails(courseIdentifier);
  };

  useEffect(() => {
    // Flatten and combine all events
    let allEvents: EventItem[] = [];

    const processEvents = async () => {
      const processedEvents: EventItem[] = [];

      for (let idx = 0; idx < queries.length; idx++) {
        const q = queries[idx];
        if (q.data && Array.isArray(q.data)) {
          const type = eventFetchers[idx].type;
          console.log(`Processing ${type} events:`, q.data);

          for (const item of q.data) {
            // Compose a message based on event type
            let message = "";
            let id = `${type}-${item.id}`;
            let blockNumber = item.blockNumber;
            let timestamp = item.timestamp;

            switch (type) {
              case "CourseCreated": {
                message = `${truncateAddress(item.courseCreator || "")} created '${item.name || "Unnamed"}'`;
                break;
              }
              case "CourseReplaced": {
                const replacedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `${truncateAddress(item.owner_ || "")} replaced "${replacedCourseName}"`;
                break;
              }
              case "CourseCertClaimed": {
                const certCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `${truncateAddress(item.candidate || "")} claimed certificate for "${certCourseName}"`;
                break;
              }
              case "AdminTransferred": {
                message = `${truncateAddress(item.owner_ || "")} became admin`;
                break;
              }
              case "AcquiredCourse": {
                const acquiredCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `${truncateAddress(item.owner || "")} acquired "${acquiredCourseName}"`;
                break;
              }
              case "CourseSuspended": {
                const suspendedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${suspendedCourseName}" was suspended`;
                break;
              }
              case "CourseUnsuspended": {
                const unsuspendedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${unsuspendedCourseName}" was unsuspended`;
                break;
              }
              case "CourseRemoved": {
                const removedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${removedCourseName}" was removed`;
                break;
              }
              case "CoursePriceUpdated": {
                const priceCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${priceCourseName}" price updated to ${item.newPrice || "unknown"}`;
                break;
              }
              case "CourseApproved": {
                const approvedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${approvedCourseName}" was approved`;
                break;
              }
              case "CourseUnapproved": {
                const unapprovedCourseName = await getCourseName(
                  item.courseIdentifier,
                );
                message = `"${unapprovedCourseName}" was unapproved`;
                break;
              }
              default: {
                message = `${type} event`;
              }
            }

            processedEvents.push({
              id,
              message,
              blockNumber,
              timestamp,
              type,
            });
          }
        }
      }

      console.log("All processed events:", processedEvents);

      // Sort by blockNumber descending (newest first)
      processedEvents.sort((a, b) => b.blockNumber - a.blockNumber);

      console.log("Sorted events by block number:", processedEvents);
      setEvents(processedEvents);
    };

    processEvents();
  }, [queries.map((q) => q.data).join(",")]);

  // Reset to first page when events change
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // Calculate pagination values
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentItems = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  function truncateAddress(address: string) {
    if (!address) return "Unknown";
    return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
  }

  function formatTimestamp(timestamp: string) {
    try {
      const date = parseISO(timestamp);
      if (isNaN(date.getTime())) return "Invalid date";
      return format(date, "MMM dd, yyyy HH:mm:ss");
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid date";
    }
  }

  function formatTime(timestamp: string) {
    try {
      const date = parseISO(timestamp);
      if (isNaN(date.getTime())) return "";
      return format(date, "h:mm a").toUpperCase();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  }

  // Loading state
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  console.log("Render state:", {
    isLoading,
    isError,
    eventsCount: events.length,
  });

  return (
    <div className=" mx-auto mt-4">
      {/* Header row */}
      <div className="flex justify-between items-center py-3 px-4 bg-[#ECD9FF] rounded-lg mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9B51E052] mr-2">
            <Package className="h-4 w-4 text-[#5801A9]" />
          </div>
          <span className="text-sm font-medium text-[#5801A9]">
            Event Details
          </span>
        </div>
        <span className="text-sm font-medium text-[#5801A9]">Timestamp</span>
      </div>
      {/* Activity items */}
      <div ref={feedRef} className="space-y-2">
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Loading events...
          </p>
        ) : isError ? (
          <p className="text-red-500 text-center py-8">Error loading events.</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity
          </p>
        ) : (
          <>
            {currentItems.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="flex justify-between items-center py-3 px-4 bg-[#F9F5FF] hover:bg-[#F0E6FF] transition-colors duration-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D8C3F2] mr-2">
                    <Package className="h-4 w-4 text-[#5801A9]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#5801A9]">
                      Block #{event.blockNumber}
                    </p>
                    <p className="text-xs text-[#7F56D9]">{event.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#5801A9]">
                    {formatTimestamp(event.timestamp)}
                  </p>
                  <p className="text-xs text-[#7F56D9]">
                    {formatTime(event.timestamp)}
                  </p>
                </div>
              </div>
            ))}

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

export default EventFeed;
