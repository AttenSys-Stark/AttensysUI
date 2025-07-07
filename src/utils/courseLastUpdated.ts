import { api } from "@/services/api";
import { format, parseISO } from "date-fns";

export interface CourseLastUpdated {
  courseIdentifier: number;
  lastUpdated: string;
  eventType: "COURSE_CREATED" | "COURSE_REPLACED";
}

/**
 * Fetches the last updated timestamp for a specific course
 * @param courseIdentifier - The course identifier
 * @param userAddress - The user's address to filter events
 * @returns Promise<CourseLastUpdated | null>
 */
export const getCourseLastUpdated = async (
  courseIdentifier: number,
  userAddress: string,
): Promise<CourseLastUpdated | null> => {
  try {
    // Get all events for the user
    const events = await api.getEventsByAddress(userAddress);

    // Filter events for this specific course
    const courseEvents = events.filter(
      (event) => event.courseIdentifier === courseIdentifier,
    );

    if (courseEvents.length === 0) {
      return null;
    }

    // Sort events by timestamp (newest first)
    courseEvents.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    // Get the most recent event
    const latestEvent = courseEvents[0];

    return {
      courseIdentifier,
      lastUpdated: latestEvent.timestamp,
      eventType: latestEvent.type as "COURSE_CREATED" | "COURSE_REPLACED",
    };
  } catch (error) {
    console.error("Error fetching course last updated:", error);
    return null;
  }
};

/**
 * Fetches last updated timestamps for multiple courses
 * @param courseIdentifiers - Array of course identifiers
 * @param userAddress - The user's address to filter events
 * @returns Promise<CourseLastUpdated[]>
 */
export const getCoursesLastUpdated = async (
  courseIdentifiers: number[],
  userAddress: string,
): Promise<CourseLastUpdated[]> => {
  try {
    // Get all events for the user
    const events = await api.getEventsByAddress(userAddress);

    const results: CourseLastUpdated[] = [];

    for (const courseId of courseIdentifiers) {
      // Filter events for this specific course
      const courseEvents = events.filter(
        (event) => event.courseIdentifier === courseId,
      );

      if (courseEvents.length > 0) {
        // Sort events by timestamp (newest first)
        courseEvents.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });

        // Get the most recent event
        const latestEvent = courseEvents[0];

        results.push({
          courseIdentifier: courseId,
          lastUpdated: latestEvent.timestamp,
          eventType: latestEvent.type as "COURSE_CREATED" | "COURSE_REPLACED",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching courses last updated:", error);
    return [];
  }
};

/**
 * Formats a timestamp for display
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string
 */
export const formatLastUpdated = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";
    return format(date, "MM/dd/yyyy");
  } catch (error) {
    return "Invalid date";
  }
};

/**
 * Gets a human-readable description of the last update
 * @param eventType - The type of event that occurred
 * @returns Human-readable description
 */
export const getLastUpdateDescription = (
  eventType: "COURSE_CREATED" | "COURSE_REPLACED",
): string => {
  switch (eventType) {
    case "COURSE_CREATED":
      return "Created";
    case "COURSE_REPLACED":
      return "Updated";
    default:
      return "Modified";
  }
};

/**
 * Gets a fallback date when API data is not available
 * @returns Current date as fallback
 */
export const getFallbackDate = (): string => {
  return format(new Date(), "MM/dd/yyyy");
};
