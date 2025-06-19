const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    | "unapproved";
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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
};
