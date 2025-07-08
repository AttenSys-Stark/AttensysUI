const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://attensys-1a184d8bebe7.herokuapp.com/api";

console.log("API_BASE_URL:", API_BASE_URL);

export interface Course {
  id: number;
  courseIdentifier: number;
  owner?: string;
  candidate?: string;
  blockNumber: number;
  timestamp: string;
  // Course created specific fields
  courseAddress?: string;
  courseCreator?: string;
  accessment?: boolean;
  baseUri?: string;
  name?: string;
  symbol?: string;
  courseIpfsUri?: string;
  isApproved?: boolean;
  // Course replaced specific fields
  owner_?: string;
  newCourseUri?: string;
  // Course price updated specific fields
  newPrice?: number;
  // Admin transferred specific fields
  newAdmin?: string;
  // Event type for UI display
  type?:
    | "created"
    | "acquired"
    | "replaced"
    | "cert-claimed"
    | "admin-transferred"
    | "suspended"
    | "unsuspended"
    | "removed"
    | "price-updated"
    | "approved"
    | "unapproved"
    | "COURSE_CREATED"
    | "COURSE_REPLACED"
    | "CERT_CLAIMED"
    | "ADMIN_TRANSFERRED"
    | "COURSE_ACQUIRED";
  // Event type for API consistency
  eventType?:
    | "created"
    | "acquired"
    | "replaced"
    | "cert-claimed"
    | "admin-transferred"
    | "suspended"
    | "unsuspended"
    | "removed"
    | "price-updated"
    | "approved"
    | "unapproved";
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(
      `API Error: ${response.status} - ${errorData.details || errorData.error || "Failed to fetch data"}`,
    );
    throw new Error(
      errorData.details || errorData.error || "Failed to fetch data",
    );
  }

  return response.json();
};

// Helper function to add event type to courses
const addEventType = (courses: Course[], type: Course["type"]): Course[] => {
  return courses.map((course) => ({ ...course, type }));
};

// Utility to canonicalize Starknet addresses to 0x + 64 hex chars
export function toCanonicalAddress(address: string): string {
  if (!address) return address;
  if (!address.startsWith("0x")) return address;
  const hex = address.slice(2).padStart(64, "0");
  return "0x" + hex;
}

export const api = {
  // Get all acquired courses
  getAcquiredCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/acquired`);
    const courses = await handleResponse(response);
    return addEventType(courses, "acquired");
  },

  // Get all created courses
  getCreatedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/created`);
    const courses = await handleResponse(response);
    return addEventType(courses, "created");
  },

  // Get all replaced courses
  getReplacedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/replaced`);
    const courses = await handleResponse(response);
    return addEventType(courses, "replaced");
  },

  // Get all cert claimed courses
  getCertClaimedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/cert-claimed`);
    const courses = await handleResponse(response);
    return addEventType(courses, "cert-claimed");
  },

  // Get all admin transferred courses
  getAdminTransferredCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/admin-transferred`);
    const courses = await handleResponse(response);
    return addEventType(courses, "admin-transferred");
  },

  // Get all suspended courses
  getSuspendedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/suspended`);
    const courses = await handleResponse(response);
    return addEventType(courses, "suspended");
  },

  // Get all unsuspended courses
  getUnsuspendedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/unsuspended`);
    const courses = await handleResponse(response);
    return addEventType(courses, "unsuspended");
  },

  // Get all removed courses
  getRemovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/removed`);
    const courses = await handleResponse(response);
    return addEventType(courses, "removed");
  },

  // Get all price updated courses
  getPriceUpdatedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/price-updated`);
    const courses = await handleResponse(response);
    return addEventType(courses, "price-updated");
  },

  // Get all approved courses
  getApprovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/approved`);
    const courses = await handleResponse(response);
    return addEventType(courses, "approved");
  },

  // Get all unapproved courses
  getUnapprovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/unapproved`);
    const courses = await handleResponse(response);
    return addEventType(courses, "unapproved");
  },

  // Get course by identifier
  getCourseByIdentifier: async (identifier: string): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/courses/${identifier}`);
    return handleResponse(response);
  },

  // Get courses by owner
  getCoursesByOwner: async (owner: string): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/owner/${owner}`);
    const courses = await handleResponse(response);
    return addEventType(courses, "acquired");
  },

  // Get all events for a specific address (personalized notifications)
  getEventsByAddress: async (address: string): Promise<Course[]> => {
    try {
      console.log("API: Fetching events for address:", address);
      console.log("API: Using base URL:", API_BASE_URL);

      const canonicalAddress = toCanonicalAddress(address);
      const response = await fetch(
        `${API_BASE_URL}/events/address/${canonicalAddress}`,
      );
      console.log("API: Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API: Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const events = await handleResponse(response);
      console.log("API: Fetched events:", events);
      return events;
    } catch (error) {
      console.error("API: Error fetching events:", error);
      // Return empty array instead of throwing
      return [];
    }
  },

  // Get unread notifications for a specific address
  getUnreadNotifications: async (address: string): Promise<Course[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/address/${address}/unread`,
      );
      const events = await handleResponse(response);
      return events;
    } catch (error) {
      // Fallback: return all notifications as unread for testing
      console.log("Using fallback for unread notifications");
      const allEvents = await api.getEventsByAddress(address);
      return allEvents;
    }
  },

  // Mark notifications as read for a specific address
  markNotificationsAsRead: async (
    address: string,
    notificationIds?: string[],
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/address/${address}/mark-read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificationIds }),
        },
      );
      return handleResponse(response);
    } catch (error) {
      // Fallback: store read status in localStorage for testing
      console.log("Using fallback for marking notifications as read");
      const readStatusKey = `notifications_read_${address}`;
      const currentReadStatus = JSON.parse(
        localStorage.getItem(readStatusKey) || "{}",
      );

      if (notificationIds) {
        notificationIds.forEach((id) => {
          currentReadStatus[id] = true;
        });
      } else {
        // Mark all notifications as read
        const allEvents = await api.getEventsByAddress(address);
        allEvents.forEach((event) => {
          const id = `${event.type || "unknown"}-${event.id}`;
          currentReadStatus[id] = true;
        });
      }

      localStorage.setItem(readStatusKey, JSON.stringify(currentReadStatus));
    }
  },

  // Get notification read status for a specific address
  getNotificationReadStatus: async (
    address: string,
  ): Promise<{ [key: string]: boolean }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/address/${address}/read-status`,
      );
      return handleResponse(response);
    } catch (error) {
      // Fallback: get read status from localStorage for testing
      console.log("Using fallback for notification read status");
      const readStatusKey = `notifications_read_${address}`;
      return JSON.parse(localStorage.getItem(readStatusKey) || "{}");
    }
  },

  // Get all courses info (from blockchain)
  getAllCoursesInfo: async (): Promise<any> => {
    // Import the helper dynamically to avoid circular deps
    const { getAllCoursesInfo } = await import("@/utils/helpers");
    return getAllCoursesInfo();
  },
};
