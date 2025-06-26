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

  useEffect(() => {
    // Flatten and combine all events
    let allEvents: EventItem[] = [];
    queries.forEach((q, idx) => {
      if (q.data && Array.isArray(q.data)) {
        const type = eventFetchers[idx].type;
        console.log(`Processing ${type} events:`, q.data);

        const processedEvents = q.data.map((item: Course) => {
          // Compose a message based on event type
          let message = "";
          let id = `${type}-${item.id}`;
          let blockNumber = item.blockNumber;
          let timestamp = item.timestamp;

          switch (type) {
            case "CourseCreated":
              message = `${truncateAddress(item.courseCreator || "")} created course '${item.name || "Unnamed"}'`;
              break;
            case "CourseReplaced":
              message = `${truncateAddress(item.owner_ || "")} replaced course #${item.courseIdentifier}`;
              break;
            case "CourseCertClaimed":
              message = `${truncateAddress(item.candidate || "")} claimed certificate for course #${item.courseIdentifier}`;
              break;
            case "AdminTransferred":
              message = `${truncateAddress(item.owner_ || "")} became admin`;
              break;
            case "AcquiredCourse":
              message = `${truncateAddress(item.owner || "")} acquired course #${item.courseIdentifier}`;
              break;
            case "CourseSuspended":
              message = `Course #${item.courseIdentifier} was suspended`;
              break;
            case "CourseUnsuspended":
              message = `Course #${item.courseIdentifier} was unsuspended`;
              break;
            case "CourseRemoved":
              message = `Course #${item.courseIdentifier} was removed`;
              break;
            case "CoursePriceUpdated":
              message = `Course #${item.courseIdentifier} price updated to ${item.newPrice || "unknown"}`;
              break;
            case "CourseApproved":
              message = `Course #${item.courseIdentifier} was approved`;
              break;
            case "CourseUnapproved":
              message = `Course #${item.courseIdentifier} was unapproved`;
              break;
            default:
              message = `${type} event`;
          }
          return {
            id,
            message,
            blockNumber,
            timestamp,
            type,
          };
        });

        allEvents = allEvents.concat(processedEvents);
      }
    });

    console.log("All processed events:", allEvents);

    // Sort by blockNumber descending (newest first)
    allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

    console.log("Sorted events by block number:", allEvents);
    setEvents(allEvents);
  }, [queries.map((q) => q.data).join(",")]);

  useEffect(() => {
    if (feedRef.current && events.length > 0) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

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
      <div
        ref={feedRef}
        className="space-y-2 max-h-[700px] overflow-y-auto pr-1"
      >
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
          events.map((event, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default EventFeed;
