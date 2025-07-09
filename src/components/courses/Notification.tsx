import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { api, Course } from "@/services/api";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationItem {
  id: string;
  type: string;
  eventType: string;
  message: string;
  timestamp: string;
  blockNumber: number;
  courseIdentifier?: number;
  courseCreator?: string;
  owner?: string;
  candidate?: string;
  newAdmin?: string;
  name?: string;
  isRead?: boolean;
}

interface CourseDetails {
  [key: number]: string; // courseIdentifier -> courseName
}

interface NotificationProps {
  wallet?: any;
  address?: string;
}

// Helper function to normalize address format
const normalizeAddress = (address: string): string => {
  if (!address || typeof address !== "string") return "";
  address = address.trim();
  if (address.startsWith("0x")) {
    // Always pad to 64 hex characters after 0x
    return "0x" + address.slice(2).padStart(64, "0");
  }
  // If missing 0x, add it and pad
  return "0x" + address.padStart(64, "0");
};

const Notification = ({ wallet, address }: NotificationProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({});

  // Use address prop if available, otherwise try to get from wallet
  const effectiveAddress =
    address || wallet?.address || wallet?.selectedAddress;
  const normalizedAddress = normalizeAddress(effectiveAddress);

  // Use notification context
  const {
    notifications: contextNotifications,
    markAllAsRead,
    isLoading: contextLoading,
    isError: contextError,
  } = useNotifications();

  // Only call markAllAsRead once per mount if there are unread notifications
  const [markedAllRead, setMarkedAllRead] = useState(false);
  useEffect(() => {
    if (
      !markedAllRead &&
      contextNotifications.length > 0 &&
      contextNotifications.some((n) => !n.isRead)
    ) {
      markAllAsRead();
      setMarkedAllRead(true);
    }
  }, [contextNotifications, markAllAsRead, markedAllRead]);

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

  // Use context notifications if available, otherwise fall back to API
  const {
    data: eventsData,
    isLoading: apiLoading,
    error,
    isError: apiError,
  } = useQuery({
    queryKey: ["userEvents", normalizedAddress],
    queryFn: async () => {
      if (!normalizedAddress) {
        return [];
      }

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://attensys-1a184d8bebe7.herokuapp.com/api";

        // Test if the API is accessible
        const testResponse = await fetch(
          `${apiUrl}/events/address/${normalizedAddress}`,
        );

        const result = await api.getEventsByAddress(normalizedAddress);

        // Also fetch course approval events for courses created by this user
        const [approvedCourses, unapprovedCourses] = await Promise.all([
          api.getApprovedCourses(),
          api.getUnapprovedCourses(),
        ]);

        // Filter approval events for courses created by this user
        // We need to fetch course details to get the creator address
        const userApprovedCourses = [];
        const userUnapprovedCourses = [];

        // Check approved courses
        for (const course of approvedCourses) {
          try {
            const courseDetails = await api.getCourseByIdentifier(
              course.courseIdentifier.toString(),
            );
            if (courseDetails.courseCreator === normalizedAddress) {
              userApprovedCourses.push(course);
            }
          } catch (error) {
            console.error(
              `Error fetching course details for ${course.courseIdentifier}:`,
              error,
            );
          }
        }

        // Check unapproved courses
        for (const course of unapprovedCourses) {
          try {
            const courseDetails = await api.getCourseByIdentifier(
              course.courseIdentifier.toString(),
            );
            if (courseDetails.courseCreator === normalizedAddress) {
              userUnapprovedCourses.push(course);
            }
          } catch (error) {
            console.error(
              `Error fetching course details for ${course.courseIdentifier}:`,
              error,
            );
          }
        }

        // Combine all events
        const allEvents = [
          ...result,
          ...userApprovedCourses.map((course) => ({
            ...course,
            type: "COURSE_APPROVED",
            eventType: "approved",
          })),
          ...userUnapprovedCourses.map((course) => ({
            ...course,
            type: "COURSE_UNAPPROVED",
            eventType: "unapproved",
          })),
        ];

        return allEvents;
      } catch (err) {
        // Don't throw the error, return empty array instead
        return [];
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: !!normalizedAddress && contextNotifications.length === 0, // Only run if no context notifications
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  });

  // Use context notifications if available, otherwise use API data
  const finalNotifications =
    contextNotifications.length > 0 ? contextNotifications : notifications;
  const isLoading = contextLoading || apiLoading;
  const isError = contextError || apiError;

  React.useEffect(() => {
    if (!eventsData || !Array.isArray(eventsData)) {
      setNotifications([]);
      return;
    }

    const processNotifications = async () => {
      const processedNotifications: NotificationItem[] = [];

      for (const event of eventsData) {
        let message = "";
        let id = `${event.type || "unknown"}-${event.id}`;

        switch (event.type) {
          case "COURSE_CREATED": {
            message = `You created '${event.name || "Unnamed"}'`;
            break;
          }
          case "COURSE_REPLACED": {
            const replacedCourseName = await getCourseName(
              event.courseIdentifier,
            );
            message = `You replaced "${replacedCourseName}"`;
            break;
          }
          case "CERT_CLAIMED": {
            const certCourseName = await getCourseName(event.courseIdentifier);
            message = `You claimed certificate for "${certCourseName}"`;
            break;
          }
          case "ADMIN_TRANSFERRED": {
            message = `You became an admin`;
            break;
          }
          case "COURSE_ACQUIRED": {
            const acquiredCourseName = await getCourseName(
              event.courseIdentifier,
            );
            message = `You acquired "${acquiredCourseName}"`;
            break;
          }
          case "COURSE_APPROVED": {
            const approvedCourseName = await getCourseName(
              event.courseIdentifier,
            );
            message = `"${approvedCourseName}" was approved`;
            break;
          }
          case "COURSE_UNAPPROVED": {
            const unapprovedCourseName = await getCourseName(
              event.courseIdentifier,
            );
            message = `"${unapprovedCourseName}" was unapproved`;
            break;
          }
          case "COURSE_REMOVED": {
            const removedCourseName = await getCourseName(
              event.courseIdentifier,
            );
            message = `"${removedCourseName}" was removed`;
            break;
          }
          default: {
            message = `${event.type || "Unknown"} event`;
          }
        }

        const notification = {
          id,
          type: event.type || "unknown",
          eventType: event.eventType || event.type || "unknown",
          message,
          timestamp: event.timestamp,
          blockNumber: event.blockNumber,
          courseIdentifier: event.courseIdentifier,
          courseCreator: event.courseCreator,
          owner: event.owner,
          candidate: event.candidate,
          newAdmin: event.newAdmin,
          name: event.name,
        };

        processedNotifications.push(notification);
      }

      // Sort by block number (newest first)
      processedNotifications.sort(
        (a: NotificationItem, b: NotificationItem) =>
          b.blockNumber - a.blockNumber,
      );

      setNotifications(processedNotifications);
    };

    processNotifications();
  }, [eventsData, courseDetails]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      if (isNaN(date.getTime())) return "Invalid date";
      return format(date, "MMM dd, yyyy HH:mm:ss");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      if (isNaN(date.getTime())) return "";
      return format(date, "h:mm a").toUpperCase();
    } catch (error) {
      return "";
    }
  };

  if (!normalizedAddress) {
    return (
      <div className="bg-white py-6 my-0 sm:my-12 lg:mx-2 rounded-xl border-[1px] border-[#BCBCBC]">
        <div className="px-12 py-5">
          <h1 className="font-bold text-lg text-[#A01B9B]">Notifications</h1>
        </div>
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="text-sm h-[1014px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Loading address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6 my-0 sm:my-12 lg:mx-2 rounded-xl border-[1px] border-[#BCBCBC]">
      {/* header */}
      <div className="px-12 py-5">
        <h1 className="font-bold text-lg text-[#A01B9B]">
          Notifications ({finalNotifications.length})
        </h1>
      </div>

      {/* content */}
      <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="text-sm h-[1014px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Loading notifications...
            </p>
          ) : isError ? (
            <p className="text-red-500 text-center py-8">
              Error loading notifications. Please try again later.
            </p>
          ) : finalNotifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No notifications yet
            </p>
          ) : (
            finalNotifications.map((item, i) => (
              <div
                key={`notification-${i}-${item.blockNumber}`}
                className="group transition-all duration-200 ease-in-out"
              >
                <div
                  className={`py-4 px-6 lg:px-8 min-h-[80px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } group-hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                    !item.isRead ? "border-l-4" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${
                        (
                          {
                            COURSE_CREATED: "bg-red-100",
                            CERT_CLAIMED: "bg-indigo-500",
                            COURSE_REPLACED: "bg-amber-500",
                            ADMIN_TRANSFERRED: "bg-purple-500",
                            COURSE_ACQUIRED: "bg-blue-500",
                            COURSE_APPROVED: "bg-green-500",
                            COURSE_UNAPPROVED: "bg-orange-500",
                            COURSE_REMOVED: "bg-red-500",
                          } as Record<string, string>
                        )[item.type] || "bg-gray-400"
                      }`}
                    ></div>

                    <p className="text-gray-800 font-medium leading-snug">
                      <span className="font-semibold text-gray-900">
                        {item.message}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pl-5 sm:pl-0">
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </p>
                    <p className="hidden sm:block text-gray-300">|</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
