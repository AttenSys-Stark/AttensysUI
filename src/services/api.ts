const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Course {
  id: number;
  courseIdentifier: number;
  owner?: string;
  candidate?: string;
  blockNumber?: number;
  blockTimestamp?: number;
  timestamp?: string;
  type?: string;
  // Add other fields as needed
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

export const api = {
  // Get all acquired courses
  getAcquiredCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/acquired`);
    return handleResponse(response);
  },

  // Get all created courses
  getCreatedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/created`);
    return handleResponse(response);
  },

  // Get all replaced courses
  getReplacedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/replaced`);
    return handleResponse(response);
  },

  // Get all cert claimed courses
  getCertClaimedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/cert-claimed`);
    return handleResponse(response);
  },

  // Get all admin transferred courses
  getAdminTransferredCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/admin-transferred`);
    return handleResponse(response);
  },

  // Get all suspended courses
  getSuspendedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/suspended`);
    return handleResponse(response);
  },

  // Get all unsuspended courses
  getUnsuspendedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/unsuspended`);
    return handleResponse(response);
  },

  // Get all removed courses
  getRemovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/removed`);
    return handleResponse(response);
  },

  // Get all price updated courses
  getPriceUpdatedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/price-updated`);
    return handleResponse(response);
  },

  // Get all approved courses
  getApprovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/approved`);
    return handleResponse(response);
  },

  // Get all unapproved courses
  getUnapprovedCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/unapproved`);
    return handleResponse(response);
  },

  // Get course by identifier
  getCourseByIdentifier: async (identifier: string): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/courses/${identifier}`);
    return handleResponse(response);
  },

  // Get courses by owner
  getCoursesByOwner: async (owner: string): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/owner/${owner}`);
    return handleResponse(response);
  },
};
